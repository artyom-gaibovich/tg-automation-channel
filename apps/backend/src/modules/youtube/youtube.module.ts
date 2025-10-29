import { Module } from '@nestjs/common';
import { YoutubeService } from './youtube.service';
import { YoutubeController } from './youtube.controller';
import { YoutubeApi } from './youtube.api';
import { CategoriesModule } from '../categories/categories.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [CategoriesModule, PrismaModule],
  controllers: [YoutubeController],
  providers: [YoutubeApi, YoutubeService],
})
export class YoutubeModule {}
