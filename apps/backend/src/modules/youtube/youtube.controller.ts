import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { YoutubeService } from './youtube.service';
import { UpdateYoutubeDto } from './dto/update-youtube.dto';
import { GetCommentsDto } from './dto/get-comments.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { mkdir, rm } from 'fs/promises';
import { existsSync } from 'fs';

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
            // Удаляем папку если существует
            if (existsSync(uploadDir)) {
              await rm(uploadDir, { recursive: true, force: true });
            }

            // Создаем новую папку
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
    @Body('categoryId') categoryId: string
  ) {
    return await this.youtubeService.translate({
      originalname: file.originalname,
      filename: file.filename,
      categoryId,
    });
  }
}
