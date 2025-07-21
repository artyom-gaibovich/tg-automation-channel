import { Injectable } from '@nestjs/common';
import { CreateUserChannelDto } from './dto/create-user-channel.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserChannelsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserChannelDto: CreateUserChannelDto) {
    return this.prismaService.userChannel.create({
      data: {
        ...createUserChannelDto,
        channelsToRewrite: JSON.stringify(
          createUserChannelDto.channelsToRewrite
        ),
      },
    });
  }

  findAllByUserId({ userId }: { userId: string }) {
    return this.prismaService.userChannel.findMany({
      where: Object.fromEntries(
        Object.entries({ userId }).filter((_, value) => value !== undefined)
      ),
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} userChannel`;
  }

  /*
  update(id: number, updateUserChannelDto: UpdateUserChannelDto) {
    return `This action updates a #${id} userChannel`;
  }
*/

  remove(id: number) {
    return `This action removes a #${id} userChannel`;
  }
}
