import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { UserChannelsModule } from '../user-channels/user-channels.module';
import { TelegramClientModule } from '../telegram-client/telegram-client.module';

@Module({
  imports: [UserChannelsModule, TelegramClientModule],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
