import { Injectable, Logger } from '@nestjs/common';
import { Api, TelegramClient } from 'telegram';
@Injectable()
export class TelegramClientService {

  private readonly logger = new Logger('TelegramClient');

  constructor( private  readonly client: TelegramClient ) {
  }

  async fetchLatestPosts(channelUsernames: string[], limit = 5) {
    const posts = [];

    for (const username of channelUsernames) {
      try {
        const entity = await this.client.getEntity(username);
        const messages = await this.client.getMessages(entity, { limit });

        const parsed = messages.map((msg: Api.Message) => ({
          channel: username,
          messageId: msg.id,
          text: msg.message,
          date: msg.date,
        }));

        posts.push(...parsed);
      } catch (err) {
        if (err instanceof Error) {
        this.logger.warn(`Cannot fetch from ${username}: ${err.message}`);
        }
      }
    }

    return posts;
  }
}
