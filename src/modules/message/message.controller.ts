import { Body, Controller, Post } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('messages')
export class MessageController {
  constructor(private readonly messagesService: MessageService) {}

  @Post('rewrite')
  rewriteContent(@Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.rewriteContent(createMessageDto);
  }
}
