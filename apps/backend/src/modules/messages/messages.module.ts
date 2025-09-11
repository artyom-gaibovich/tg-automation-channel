import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { UserChannelsModule } from '../user-channels/user-channels.module';
import { TelegramClientModule } from '../telegram-client/telegram-client.module';
import { AiAgentModule } from '../ai-agent/ai-agent.module';

@Module({
  imports: [UserChannelsModule, TelegramClientModule, AiAgentModule],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
