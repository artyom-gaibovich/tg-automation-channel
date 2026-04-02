import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { UserChannelModule } from '../user-channel/user-channel.module';
import { TelegramClientModule } from '../telegram-client/telegram-client.module';

@Module({
  imports: [UserChannelModule, TelegramClientModule],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
