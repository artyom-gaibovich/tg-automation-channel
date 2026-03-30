import { Module } from '@nestjs/common';
import { UserChannelService } from './user-channel.service';
import { UserChannelController } from './user-channel.controller';

@Module({
  imports: [],
  controllers: [UserChannelController],
  providers: [UserChannelService],
  exports: [UserChannelService],
})
export class UserChannelModule {}
