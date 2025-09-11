import { Module } from '@nestjs/common';
import { YoutubeService } from './youtube.service';
import { YoutubeController } from './youtube.controller';
import { YoutubeApi } from './youtube.api';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [CategoriesModule],
  controllers: [YoutubeController],
  providers: [YoutubeApi, YoutubeService],
})
export class YoutubeModule {}
