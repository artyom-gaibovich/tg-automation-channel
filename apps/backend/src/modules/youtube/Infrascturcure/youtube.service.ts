import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { YoutubeApi } from './youtube.api';
import { CategoriesService } from '../../categories/categories.service';
import { unlink } from 'node:fs/promises';
import path from 'path';
import { PrismaService } from '../../shared/persistence/prisma/prisma.service';
import { extractVideo } from '../../../../data';

@Injectable()
export class YoutubeService {
  constructor(
    private readonly youtubeApi: YoutubeApi,
    private readonly categoriesService: CategoriesService,
    private readonly prismaService: PrismaService
  ) {}

  private extractVideoId(url: string): string {
    const regexes = [
      /(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      /shorts\/([a-zA-Z0-9_-]{11})/,
    ];

    for (const regex of regexes) {
      const match = url.match(regex);
      if (match && match[1]) {
        return match[1];
      }
    }

    throw new BadRequestException('Не удалось извлечь videoId');
  }

  async getCommentsByUrl({
    videoUrl,
    categoryId,
  }: {
    videoUrl: string;
    categoryId: string;
  }) {
    const videoId = this.extractVideoId(videoUrl);
    const category = await this.categoriesService.findOne(categoryId);
    if (!category) throw new NotFoundException();

    const [comments, videoInfo] = await Promise.all([
      this.youtubeApi.getComments(videoId),
      this.youtubeApi.getVideoInfo(videoId),
    ]);

    const msg = `
      [Название видео]
      ${videoInfo.title}

      [Промпт]
      ${category.prompt}

      [Комментарии]
      ${comments
        .map(
          (comment, index) =>
            `${index}. Автор: ${comment.author}, Комментарий: ${comment.text}`
        )
        .join('\n')}
      `;
    return msg;
  }

  parseWhisperText(rawText: string, language = 'ru') {
    const lines = rawText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    const regex =
      /^\[(\d{2}:\d{2}:\d{2}\.\d{3}) --> (\d{2}:\d{2}:\d{2}\.\d{3})\]\s*(.*)$/;

    const transcription = [];

    // утилита: HH:MM:SS.mmm → миллисекунды
    const toMs = (t: string) => {
      const [h, m, s] = t.split(':');
      const [sec, ms] = s.split('.');
      return (
        parseInt(h) * 3600000 +
        parseInt(m) * 60000 +
        parseInt(sec) * 1000 +
        parseInt(ms)
      );
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
    const absPath = path.join(process.cwd(), 'uploads', filename);

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

      await unlink(absPath).catch(() => {});

      return { filename, result: result };
    } catch (error) {
      await unlink(absPath).catch(() => {});
      throw error;
    }
  }
}
