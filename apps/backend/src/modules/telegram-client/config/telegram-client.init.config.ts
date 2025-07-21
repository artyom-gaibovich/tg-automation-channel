import { ConfigService } from '@nestjs/config';
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';

export const telegramClientInitConfig = async (
  configService: ConfigService
): Promise<TelegramClient> => {
  const apiId = configService.get<number>('API_ID');
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
};
