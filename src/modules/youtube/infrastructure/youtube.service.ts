import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { YoutubeApi } from './youtube.api';
import { CategoryService } from '../../category/category.service';
import { unlink } from 'node:fs/promises';
import path from 'path';
import { PrismaService } from '../../shared/persistence/prisma/prisma.service';
import { extractVideo } from '../../transcription/infrastructure/whisper/whisper';
import axios from 'axios';

const PATHS = {
  UPLOAD_DIR: path.join(process.cwd(), 'uploads'),
  ROOT_DIR: process.cwd(),
} as const;

interface YoutubeSubscriptionItem {
  snippet: {
    resourceId: { channelId: string };
    title: string;
    description: string;
    thumbnails: unknown;
  };
}

interface YoutubeSubscriptionsResponse {
  items: YoutubeSubscriptionItem[];
  nextPageToken?: string;
  pageInfo: { totalResults: number };
}

interface YoutubeChannelsResponse {
  items: Array<{ id: string }>;
}

interface YoutubeSearchResponse {
  items: Array<{ snippet: { channelId: string } }>;
}

@Injectable()
export class YoutubeService {
  private readonly logger = new Logger(YoutubeService.name);

  constructor(
    private readonly youtubeApi: YoutubeApi,
    private readonly categoriesService: CategoryService,
    private readonly prismaService: PrismaService,
  ) {}

  private readonly baseUrl = 'https://www.googleapis.com/youtube/v3';
  private readonly apiKey = process.env.YOUTUBE_API_KEY;

  async getChannelSubscriptions(channelId: string, maxResults = 50, pageToken?: string) {
    const url = `${this.baseUrl}/subscriptions`;

    const params: Record<string, string | number | undefined> = {
      part: 'snippet',
      channelId: channelId,
      maxResults: Math.min(maxResults, 500), // Максимум 50 за запрос
      order: 'alphabetical',
      key: this.apiKey,
    };

    if (pageToken) {
      params.pageToken = pageToken;
    }

    const res = await axios.get<YoutubeSubscriptionsResponse>(url, { params });

    const subscriptions = res.data.items.map((item) => ({
      channelId: item.snippet.resourceId.channelId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails,
    }));

    return {
      subscriptions,
      nextPageToken: res.data.nextPageToken,
      totalResults: res.data.pageInfo.totalResults,
    };
  }

  async getChannelIdByUsername(username: string): Promise<string> {
    const url = `${this.baseUrl}/channels`;

    try {
      const res = await axios.get<YoutubeChannelsResponse>(url, {
        params: {
          part: 'id,snippet',
          forHandle: `@${username.replace('@', '')}`,
          key: this.apiKey,
        },
      });

      if (res.data.items.length > 0) {
        return res.data.items[0].id;
      }

      const searchUrl = `${this.baseUrl}/search`;
      const searchRes = await axios.get<YoutubeSearchResponse>(searchUrl, {
        params: {
          part: 'snippet',
          q: username,
          type: 'channel',
          maxResults: 1,
          key: this.apiKey,
        },
      });

      if (searchRes.data.items.length > 0) {
        return searchRes.data.items[0].snippet.channelId;
      }

      throw new Error('Канал не найден');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Ошибка поиска канала: ${message}`);
    }
  }

  private extractVideoId(url: string): string {
    const regexes = [/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/, /shorts\/([a-zA-Z0-9_-]{11})/];

    for (const regex of regexes) {
      const match = url.match(regex);
      if (match?.[1]) {
        return match[1];
      }
    }

    throw new BadRequestException('Не удалось извлечь videoId');
  }

  async getCommentsByUrl({ videoUrl, categoryId }: { videoUrl: string; categoryId: string }) {
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
        .map((comment, index) => `${index}. Автор: ${comment.author}, Комментарий: ${comment.text}`)
        .join('\n')}
      `;
    return msg;
  }

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
