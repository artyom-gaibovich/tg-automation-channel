import { Module } from '@nestjs/common';
import { VkService } from './vk.service';
import { VkController } from './vk.controller';

@Module({
  controllers: [VkController],
  providers: [VkService],
})
export class VkModule {}
