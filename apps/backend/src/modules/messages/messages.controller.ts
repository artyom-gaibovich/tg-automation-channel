import { Body, Controller, Post } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post('rewrite')
  rewriteContent(@Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.rewriteContent(createMessageDto);
  }
}
