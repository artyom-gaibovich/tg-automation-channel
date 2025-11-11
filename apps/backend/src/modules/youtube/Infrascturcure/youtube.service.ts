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
    return {
      message: msg,
      //tags: videoInfo.tags.join(', '),
    };
  }

  async translate({
    filename,
    originalName,
    code,
  }: {
    originalName: string;
    filename: string;
    code: string;
  }) {
    const absPath = path.join(process.cwd(), 'uploads', filename);

    try {
      const r1 = await extractVideo(absPath);

      const result = `
Название видео:
[вставь название здесь]

Транскрипт:
${r1}
    `;

      await this.prismaService.transcribation.create({
        data: {
          fileName: originalName,
          content: r1,
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
