import { Controller, Get } from '@nestjs/common';
import { TelegramClientService } from './telegram-client.service';

@Controller('telegram-client')
export class TelegramClientController {
  constructor(private readonly telegramClientService: TelegramClientService) {}

  @Get()
  findAll() {
    //TODO ПОПРАВИТЬ хардкод
    return this.telegramClientService.fetchLatestPosts(
      ['artyom_gaibovich', 'habr_media'],
      5
    );
  }
}
