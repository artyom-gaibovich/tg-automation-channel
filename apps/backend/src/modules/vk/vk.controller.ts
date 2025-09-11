import { Body, Controller, Post } from '@nestjs/common';
import { VkService } from './vk.service';

@Controller('vk')
export class VkController {
  constructor(private readonly vkService: VkService) {}

  @Post('post')
  async post(@Body() body: { ownerId: number; message: string }) {
    return this.vkService.postToWall(body);
  }
}
