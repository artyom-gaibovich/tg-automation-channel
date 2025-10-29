import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { TelegramClientService } from '../telegram-client/telegram-client.service';
import { UserChannelsService } from '../user-channels/user-channels.service';

@Injectable()
export class MessagesService {
  constructor(
    private readonly telegramClientService: TelegramClientService,
    private readonly userChannelsService: UserChannelsService
  ) {}

  async rewriteContent(createMessageDto: CreateMessageDto) {
    const channel = await this.userChannelsService.findOne(
      createMessageDto.userChannelId
    );
    const posts = await this.telegramClientService.fetchLatestPosts(
      JSON.parse(channel.channelsToRewrite),
      5
    );
    if (channel.category) {
      const msg = `${channel.category.prompt} posts: ${JSON.stringify(posts)}`;
      return { message: msg };
    }
    return;
  }
}
