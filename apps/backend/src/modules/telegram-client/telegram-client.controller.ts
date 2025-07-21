import { Controller, Get } from '@nestjs/common';
import { TelegramClientService } from './telegram-client.service';

@Controller('telegram-client')
export class TelegramClientController {
  constructor(private readonly telegramClientService: TelegramClientService) {}

  /*  @Post()
  create(@Body() createTelegramClientDto: CreateTelegramClientDto) {
    return this.telegramClientService.create(createTelegramClientDto);
  }*/

  @Get()
  findAll() {
    return this.telegramClientService.fetchLatestPosts(
      ['artyom_gaibovich', 'habr_media'],
      5
    );
  }

  /* @Get(':id')
  findOne(@Param('id') id: string) {
    return this.telegramClientService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTelegramClientDto: UpdateTelegramClientDto
  ) {
    return this.telegramClientService.update(+id, updateTelegramClientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.telegramClientService.remove(+id);
  }*/
}
