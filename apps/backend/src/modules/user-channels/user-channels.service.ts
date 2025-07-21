import { Injectable } from '@nestjs/common';
import { CreateUserChannelDto } from './dto/create-user-channel.dto';
import { UpdateUserChannelDto } from './dto/update-user-channel.dto';

@Injectable()
export class UserChannelsService {
  create(createUserChannelDto: CreateUserChannelDto) {
    return 'This action adds a new userChannel';
  }

  findAll() {
    return `This action returns all userChannels`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userChannel`;
  }

  update(id: number, updateUserChannelDto: UpdateUserChannelDto) {
    return `This action updates a #${id} userChannel`;
  }

  remove(id: number) {
    return `This action removes a #${id} userChannel`;
  }
}
