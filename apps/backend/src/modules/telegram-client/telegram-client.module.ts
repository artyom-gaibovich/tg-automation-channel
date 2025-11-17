import { Module } from '@nestjs/common';
import { TelegramClientService } from './telegram-client.service';
import { TelegramClientController } from './telegram-client.controller';
import { StringSession } from 'telegram/sessions';
import { TelegramClient } from 'telegram';
import { ConfigService } from '@nestjs/config';
import { EnvConfigDev } from '../../shared';

@Module({
  controllers: [TelegramClientController],
  providers: [
    TelegramClientService,
    {
      provide: TelegramClient,
      useFactory: async (
        configService: ConfigService
      ): Promise<TelegramClient> => {
        const apiId = configService.get<string>(EnvConfigDev.ApiId);
        if (!apiId) {
          throw new Error(`Missing ${EnvConfigDev.ApiId}`);
        }
        const apiHash = configService.get<string>(EnvConfigDev.ApiHash);
        if (!apiHash) {
          throw new Error(`Missing ${EnvConfigDev.ApiHash}`);
        }
        const session = configService.get<string>(EnvConfigDev.ApiSession);
        if (!session) {
          throw new Error(`Missing ${EnvConfigDev.ApiSession}`);
        }
        const stringSession = new StringSession(session);
        const client = new TelegramClient(
          stringSession,
          Number(apiId),
          apiHash,
          {
            connectionRetries: 5,
          }
        );
        await client.connect();
        return client;
      },
      inject: [ConfigService],
    },
  ],
  exports: [TelegramClient, TelegramClientService],
})
export class TelegramClientModule {}
