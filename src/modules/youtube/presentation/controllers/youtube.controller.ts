import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { YoutubeService } from '../../infrastructure/youtube.service';
import { GetCommentsDto } from '../../infrastructure/dto/get-comments.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path, { extname } from 'path';
import { mkdir, rm } from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import sanitize from 'sanitize-filename';
import { YouTubeApiContracts } from './api-contracts';

export const PATHS = {
  UPLOAD_DIR: path.join(process.cwd(), 'uploads'),
  ROOT_DIR: process.cwd(),
} as const;

@Controller('youtube')
export class YoutubeController {
  constructor(private readonly youtubeService: YoutubeService) {}

  @Post('username')
  async getChannel(@Body() dto: { username: string }) {
    return this.youtubeService.getChannelIdByUsername(dto.username);
  }

  @Post('username/subs')
  async getChannelSubs(@Body() dto: { id: string }) {
    return this.youtubeService.getChannelSubscriptions(dto.id);
  }

  @Post()
  async getComments(@Body() dto: GetCommentsDto) {
    const { videoUrl, categoryId } = dto;
    return this.youtubeService.getCommentsByUrl({ videoUrl, categoryId });
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, callback) => {
          const uploadDir = './uploads';
          const doSetup = existsSync(uploadDir)
            ? rm(uploadDir, { recursive: true, force: true }).then(() =>
                mkdir(uploadDir, { recursive: true }),
              )
            : mkdir(uploadDir, { recursive: true });
          doSetup
            .then(() => callback(null, uploadDir))
            .catch((error: Error) => callback(error, uploadDir));
        },
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Body('code') code: string) {
    return await this.youtubeService.translate({
      originalName: file.originalname,
      filename: file.filename,
      code,
      seoTags: [],
    });
  }

  @UsePipes(new ValidationPipe())
  @Post('upload-multiple')
  @UseInterceptors(
    FilesInterceptor('files', 200, {
      storage: diskStorage({
        destination: (req, file, callback) => {
          mkdirSync(PATHS.UPLOAD_DIR, { recursive: true });
          callback(null, PATHS.UPLOAD_DIR);
        },
        filename: (req, file, callback) => {
          const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
          const safeName = sanitize(originalName);
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(safeName);
          callback(null, `file-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async uploadMultiple(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: YouTubeApiContracts.Api.UploadMultiple.Request.Body,
  ) {
    const results: Array<{ file: string; result: { filename: string; result: string } }> = [];

    for (const file of files) {
      const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');

      const res = await this.youtubeService.translate({
        originalName: originalName,
        filename: file.filename,
        code: body.code,
        seoTags: body.seo_tags,
      });

      results.push({
        file: file.originalname,
        result: res,
      });
    }

    return { message: 'Файлы обработаны', results };
  }
}
