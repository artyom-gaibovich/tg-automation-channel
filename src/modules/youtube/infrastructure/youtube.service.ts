import { Injectable, Logger } from '@nestjs/common';
import { unlink } from 'node:fs/promises';
import path from 'path';
import { PrismaService } from '../../shared/persistence/prisma/prisma.service';
import { extractVideo } from '../../transcription/infrastructure/whisper/whisper';

const PATHS = {
  UPLOAD_DIR: path.join(process.cwd(), 'uploads'),
  ROOT_DIR: process.cwd(),
} as const;


@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);

  constructor(private readonly prismaService: PrismaService) {}

  parseWhisperText(rawText: string, language = 'ru') {
    const lines = rawText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    const regex = /^\[(\d{2}:\d{2}:\d{2}\.\d{3}) --> (\d{2}:\d{2}:\d{2}\.\d{3})\]\s*(.*)$/;

    const transcription: {
      timestamps: {
        from: string;
        to: string;
      };
      offsets: {
        from: number;
        to: number;
      };
      text: string;
    }[] = [];

    // утилита: HH:MM:SS.mmm → миллисекунды
    const toMs = (t: string) => {
      const [h, m, s] = t.split(':');
      const [sec, ms] = s.split('.');
      return parseInt(h) * 3600000 + parseInt(m) * 60000 + parseInt(sec) * 1000 + parseInt(ms);
    };

    // утилита: HH:MM:SS.mmm → HH:MM:SS,mmm
    const toCommaTimestamp = (t: string) => t.replace('.', ',');

    for (const line of lines) {
      const match = line.match(regex);
      if (!match) continue;

      const [, fromRaw, toRaw, text] = match;

      const fromMs = toMs(fromRaw);
      const toMsVal = toMs(toRaw);

      transcription.push({
        timestamps: {
          from: toCommaTimestamp(fromRaw),
          to: toCommaTimestamp(toRaw),
        },
        offsets: {
          from: fromMs,
          to: toMsVal,
        },
        text: text.trim(),
      });
    }

    return {
      result: {
        language,
      },
      transcription,
    };
  }

  async translate({
    filename,
    originalName,
    seoTags,
    code,
  }: {
    originalName: string;
    filename: string;
    code: string;
    seoTags: string[];
  }) {
    // Формируем абсолютный путь к файлу
    const absPath = path.join(PATHS.UPLOAD_DIR, filename);

    this.logger.log(`Processing file at: ${absPath}`);

    try {
      const res = await extractVideo(absPath);

      const parsed = this.parseWhisperText(res);
      const r1 = JSON.stringify(parsed, null, 2);

      const result = `
Название видео:
[вставь название здесь]

Транскрипт:
${r1}
      `;

      await this.prismaService.transcribation.create({
        data: {
          fileName: originalName,
          tags: seoTags,
          content: parsed,
          code: code,
        },
      });

      // Удаляем файл после обработки
      await unlink(absPath).catch((err) => {
        console.error('Failed to delete file:', err);
      });

      return { filename, result: result };
    } catch (error) {
      // Пытаемся удалить файл даже в случае ошибки
      await unlink(absPath).catch((err) => {
        console.error('Failed to delete file after error:', err);
      });
      throw error;
    }
  }
}
