import { Module } from '@nestjs/common';
import { UserChannelsService } from './user-channels.service';
import { UserChannelsController } from './user-channels.controller';

@Module({
  controllers: [UserChannelsController],
  providers: [UserChannelsService],
})
export class UserChannelsModule {}
