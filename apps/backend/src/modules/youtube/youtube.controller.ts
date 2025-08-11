import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { YoutubeService } from './youtube.service';
import { UpdateYoutubeDto } from './dto/update-youtube.dto';
import { GetCommentsDto } from './dto/get-comments.dto';

@Controller('youtube')
export class YoutubeController {
  constructor(private readonly youtubeService: YoutubeService) {}

  @Post()
  async getComments(@Body() dto: GetCommentsDto) {
    const {videoUrl, categoryId} = dto;
    return this.youtubeService.getCommentsByUrl({videoUrl, categoryId});
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateYoutubeDto: UpdateYoutubeDto) {
    return this.youtubeService.update(+id, updateYoutubeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.youtubeService.remove(+id);
  }
}
