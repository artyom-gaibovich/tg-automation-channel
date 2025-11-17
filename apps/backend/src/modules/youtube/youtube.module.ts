import { Module } from '@nestjs/common';
import { YoutubeService } from './Infrascturcure/youtube.service';
import { YoutubeController } from './Presentation/Controllers/youtube.controller';
import { YoutubeApi } from './Infrascturcure/youtube.api';
import { CategoriesModule } from '../categories/categories.module';
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
    CategoriesModule,
    PrismaModule,
  ],
  controllers: [YoutubeController],
  providers: [YoutubeApi, YoutubeService],
})
export class YoutubeModule {}
