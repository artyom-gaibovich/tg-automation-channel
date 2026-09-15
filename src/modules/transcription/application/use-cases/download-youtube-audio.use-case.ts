import { Injectable } from '@nestjs/common';
import { YoutubeDownloaderService } from '../../infrastructure/youtube/youtube-downloader.service';
import { UseCasePort } from '../ports';

/**
 * Скачивает аудиодорожку видео с YouTube через yt-dlp в формате mp3 и
 * возвращает имя файла для последующей отдачи пользователю. В отличие от
 * TranscribeYoutubeUseCase здесь нет транскрибации — только загрузка аудио.
 */
@Injectable()
export class DownloadYoutubeAudioUseCase {
  constructor(private readonly youtubeDownloader: YoutubeDownloaderService) {}

  async execute(
    input: UseCasePort.DownloadYoutubeAudio.Input,
  ): Promise<UseCasePort.DownloadYoutubeAudio.Output> {
    const { url } = input;

    const { filename, originalName } = await this.youtubeDownloader.download(url);

    return { filename, originalName };
  }
}
