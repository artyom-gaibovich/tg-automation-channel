import { Module } from '@nestjs/common';
import { UserChannelsService } from './user-channels.service';
import { UserChannelsController } from './user-channels.controller';

@Module({
  imports: [],
  controllers: [UserChannelsController],
  providers: [UserChannelsService],
  exports: [UserChannelsService],
})
export class UserChannelsModule {}
