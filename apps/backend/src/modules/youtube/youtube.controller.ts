import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { YoutubeService } from './youtube.service';
import { UpdateYoutubeDto } from './dto/update-youtube.dto';
import { GetCommentsDto } from './dto/get-comments.dto';
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateYoutubeDto: UpdateYoutubeDto) {
    return this.youtubeService.update(+id, updateYoutubeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.youtubeService.remove(+id);
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
      categoryId,
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
          // Фиксируем кодировку имени файла
          const originalName = Buffer.from(
            file.originalname,
            'latin1'
          ).toString('utf8');
          const safeName = sanitize(originalName); // убираем опасные символы
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
    @Body('categoryId') categoryId: string,
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
        categoryId,
      });
      results.push({
        file: file.originalname,
        result: res,
      });
    }

    return { message: 'Файлы обработаны', results };
  }
}
