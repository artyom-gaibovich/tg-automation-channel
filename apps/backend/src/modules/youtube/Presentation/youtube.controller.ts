import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { YoutubeService } from '../Infrascturcure/youtube.service';
import { GetCommentsDto } from '../Infrascturcure/dto/get-comments.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { mkdir, rm } from 'fs/promises';
import { existsSync } from 'fs';
import sanitize from 'sanitize-filename';

@Controller('youtube')
export class YoutubeController {
  constructor(private readonly youtubeService: YoutubeService) {}

  @Post()
  async getComments(@Body() dto: GetCommentsDto) {
    const { videoUrl, categoryId } = dto;
    return this.youtubeService.getCommentsByUrl({ videoUrl, categoryId });
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: async (req, file, callback) => {
          const uploadDir = './uploads';

          try {
            if (existsSync(uploadDir)) {
              await rm(uploadDir, { recursive: true, force: true });
            }

            await mkdir(uploadDir, { recursive: true });

            callback(null, uploadDir);
          } catch (error) {
            if (error instanceof Error) callback(error, uploadDir);
          }
        },
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    })
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('categoryId') categoryId: string,
    @Body('code') code: string
  ) {
    return await this.youtubeService.translate({
      originalName: file.originalname,
      filename: file.filename,
      code,
    });
  }
  @Post('upload-multiple')
  @UseInterceptors(
    FilesInterceptor('files', 200, {
      storage: diskStorage({
        destination: async (req, file, callback) => {
          const uploadDir = './uploads';
          await mkdir(uploadDir, { recursive: true });
          callback(null, uploadDir);
        },
        filename: (req, file, callback) => {
          const originalName = Buffer.from(
            file.originalname,
            'latin1'
          ).toString('utf8');
          const safeName = sanitize(originalName);
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(safeName);
          callback(null, `file-${uniqueSuffix}${ext}`);
        },
      }),
    })
  )
  async uploadMultiple(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('code') code: string
  ) {
    const results = [];
    for (const file of files) {
      const originalName = Buffer.from(file.originalname, 'latin1').toString(
        'utf8'
      );
      const res = await this.youtubeService.translate({
        originalName: originalName,
        filename: file.filename,
        code,
      });
      results.push({
        file: file.originalname,
        result: res,
      });
    }

    return { message: 'Файлы обработаны', results };
  }

  /*@Get(':id')
  async getVideo(@Param('id') id: string) {
    return this.youtubeService.getVideo() {

    }
  }*/
}
