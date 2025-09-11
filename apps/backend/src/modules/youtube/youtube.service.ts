import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateYoutubeDto } from './dto/update-youtube.dto';
import { YoutubeApi } from './youtube.api';
import { CategoriesService } from '../categories/categories.service';
import path from 'path';
import { extractVideo } from '../../../data';

@Injectable()
export class YoutubeService {
  constructor(
    private readonly youtubeApi: YoutubeApi,
    private readonly categoriesService: CategoriesService
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

    return {
      message: `
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
      `,
      tags: videoInfo.tags.join(', '),
    };
  }

  async translate({
    categoryId,
    filename,
    originalname,
  }: {
    categoryId: string;
    originalname: string;
    filename: string;
  }) {
    const category = await this.categoriesService.findOne(categoryId);

    console.log(originalname);
    const absPath = path.resolve(process.cwd(), 'uploads', filename);
    const r1 = await extractVideo(absPath);

    const result = `
${category.prompt}
Название видео:
[вставь название здесь]

Транскрипт:
      ${r1}
      `;
    return { filename, result: result, prompt: category.prompt };
  }

  findOne(id: number) {
    return `This action returns a #${id} youtube`;
  }

  update(id: number, updateYoutubeDto: UpdateYoutubeDto) {
    return `This action updates a #${id} youtube`;
  }

  remove(id: number) {
    return `This action removes a #${id} youtube`;
  }
}
