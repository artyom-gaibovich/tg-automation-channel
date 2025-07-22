import { Module } from '@nestjs/common';
import { TelegramClientService } from './telegram-client.service';
import { TelegramClientController } from './telegram-client.controller';
import { StringSession } from 'telegram/sessions';
import { TelegramClient } from 'telegram';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [TelegramClientController],
  providers: [
    TelegramClientService,
    {
      provide: TelegramClient,
      useFactory: async (
        configService: ConfigService
      ): Promise<TelegramClient> => {
        const apiId = configService.get<string>('API_ID');
        if (!apiId) {
          throw new Error('No API ID');
        }
        const apiHash = configService.get<string>('API_HASH');
        if (!apiHash) {
          throw new Error('Missing API ID');
        }
        const session = configService.get<string>('API_SESSION');
        if (!session) {
          throw new Error('Missing SESSION');
        }
        const stringSession = new StringSession(session);
        const client = new TelegramClient(stringSession, Number(apiId), apiHash, {
          connectionRetries: 5,
        });
        await client.connect();
        return client;
      },
      inject: [ConfigService],
    },
  ],
  exports: [TelegramClient, TelegramClientService],
})
export class TelegramClientModule {}
