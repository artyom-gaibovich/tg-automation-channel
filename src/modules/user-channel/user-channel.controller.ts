import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { UserChannelService } from './user-channel.service';
import { CreateUserChannelDto } from './dto/create-user-channel.dto';
import { UpdateUserChannelDto } from './dto/update-user-channel.dto';

@Controller('user-channel')
export class UserChannelController {
  constructor(private readonly userChannelsService: UserChannelService) {}

  @Post()
  create(@Body() createUserChannelDto: CreateUserChannelDto) {
    return this.userChannelsService.create(createUserChannelDto);
  }

  @Get(':userId')
  findAllByUserId(@Param('userId') userId: string) {
    return this.userChannelsService.findAllByUserId({ userId });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserChannelDto: UpdateUserChannelDto) {
    return this.userChannelsService.update(id, updateUserChannelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userChannelsService.remove(id);
  }
}
