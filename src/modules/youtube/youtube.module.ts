import { Module } from '@nestjs/common';
import { YoutubeService } from './infrastructure/youtube.service';
import { YoutubeController } from './presentation/controllers/youtube.controller';
import { YoutubeApi } from './infrastructure/youtube.api';
import { CategoryModule } from '../category/category.module';
import { PrismaModule } from '../shared/persistence/prisma/prisma.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
    }),
    CategoryModule,
    PrismaModule,
  ],
  controllers: [YoutubeController],
  providers: [YoutubeApi, YoutubeService],
})
export class YoutubeModule {}
