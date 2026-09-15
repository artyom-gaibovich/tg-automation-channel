import { Injectable } from '@nestjs/common';
import { FilesService } from '../../../files/infrastructure/files.service';
import { YoutubeDownloaderService } from '../../infrastructure/youtube/youtube-downloader.service';
import { UseCasePort } from '../../presentation';

/**
 * Скачивает видео с YouTube через yt-dlp и прогоняет его через тот же
 * пайплайн транскрибации, что и загруженные вручную файлы.
 */
@Injectable()
export class TranscribeYoutubeUseCase {
  constructor(
    private readonly youtubeDownloader: YoutubeDownloaderService,
    private readonly filesService: FilesService,
  ) {}

  async execute(
    input: UseCasePort.TranscribeYoutube.Input,
  ): Promise<UseCasePort.TranscribeYoutube.Output> {
    const { url, code, seoTags } = input;

    const { filename, originalName } = await this.youtubeDownloader.download(url);

    return this.filesService.translate({
      filename,
      originalName,
      code,
      seoTags,
    });
  }
}
