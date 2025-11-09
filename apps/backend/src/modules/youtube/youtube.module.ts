import { Module } from '@nestjs/common';
import { YoutubeService } from './Infrascturcure/youtube.service';
import { YoutubeController } from './Presentation/youtube.controller';
import { YoutubeApi } from './Infrascturcure/youtube.api';
import { CategoriesModule } from '../categories/categories.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [CategoriesModule, PrismaModule],
  controllers: [YoutubeController],
  providers: [YoutubeApi, YoutubeService],
})
export class YoutubeModule {}
