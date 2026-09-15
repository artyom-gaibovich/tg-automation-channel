import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'fs';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

export interface DownloadedYoutubeFile {
  /** Имя файла внутри папки uploads (то, что ожидает whisper/FilesService). */
  filename: string;
  /** Человекочитаемое имя (заголовок видео с YouTube). */
  originalName: string;
}

/**
 * Обёртка вокруг yt-dlp (аналог ytdl.sh). Скачивает аудиодорожку видео с YouTube
 * в папку uploads в формате mp3, пригодном для транскрибации через whisper.
 */
@Injectable()
export class YoutubeDownloaderService {
  private readonly logger = new Logger(YoutubeDownloaderService.name);

  async download(url: string): Promise<DownloadedYoutubeFile> {
    mkdirSync(UPLOAD_DIR, { recursive: true });

    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const outputTemplate = path.join(UPLOAD_DIR, `yt-${uniqueSuffix}.%(ext)s`);

    // Один вызов yt-dlp: скачиваем аудио (bestaudio → mp3) и одновременно
    // печатаем заголовок. Префикс стадии (after_move:) у --print не включает
    // режим симуляции, поэтому файл реально скачивается. Один вызов вместо
    // двух — значит и macOS Keychain спрашивает доступ к кукам один раз, а не два.
    const stdout = await this.run([
      ...this.authArgs(),
      '-f',
      'bestaudio/best',
      '--extract-audio',
      '--audio-format',
      'mp3',
      '--audio-quality',
      '0',
      '--no-playlist',
      '--no-simulate',
      '--print',
      'after_move:%(title)s',
      '-o',
      outputTemplate,
      url,
    ]);

    const title =
      stdout
        .trim()
        .split(/\r?\n/)
        .filter(Boolean)
        .pop() || 'youtube-video';

    // Из-за --audio-format mp3 расширение итогового файла детерминировано.
    const filename = `yt-${uniqueSuffix}.mp3`;

    this.logger.log(`Downloaded YouTube audio to ${filename} (title: ${title})`);

    return {
      filename,
      originalName: `${title}.mp3`,
    };
  }

  /**
   * YouTube всё чаще требует аутентификацию для серверных загрузок
   * ("Sign in to confirm you're not a bot"). Позволяем передать cookies
   * через переменные окружения:
   *   YTDLP_COOKIES_FROM_BROWSER — например "chrome", "safari", "firefox"
   *   YTDLP_COOKIES_FILE — путь к экспортированному cookies.txt
   */
  private authArgs(): string[] {
    const browser = process.env.YTDLP_COOKIES_FROM_BROWSER?.trim();
    if (browser) {
      return ['--cookies-from-browser', browser];
    }

    const cookiesFile = process.env.YTDLP_COOKIES_FILE?.trim();
    if (cookiesFile) {
      return ['--cookies', cookiesFile];
    }

    return [];
  }

  private run(args: string[]): Promise<string> {
    // Позволяем указать путь к конкретному бинарнику yt-dlp
    // (например /opt/homebrew/bin/yt-dlp), если системный устарел.
    const bin = process.env.YTDLP_PATH?.trim() || 'yt-dlp';

    return new Promise((resolve, reject) => {
      const child = spawn(bin, args, { cwd: process.cwd() });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (chunk: Buffer) => {
        stdout += chunk.toString();
      });
      child.stderr.on('data', (chunk: Buffer) => {
        stderr += chunk.toString();
      });

      child.on('error', (error) => {
        this.logger.error(`Failed to spawn yt-dlp: ${error.message}`);
        reject(
          new InternalServerErrorException(
            'yt-dlp не найден. Установите его: brew install yt-dlp',
          ),
        );
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve(stdout);
          return;
        }
        this.logger.error(`yt-dlp exited with code ${code}: ${stderr}`);
        reject(new InternalServerErrorException('Не удалось скачать видео с YouTube'));
      });
    });
  }
}
