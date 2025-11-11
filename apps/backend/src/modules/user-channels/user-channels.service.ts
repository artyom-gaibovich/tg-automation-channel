import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserChannelDto } from './dto/create-user-channel.dto';
import { UpdateUserChannelDto } from './dto/update-user-channel.dto';
import { PrismaService } from '../shared/persistence/prisma/prisma.service';

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
      include: {
        category: true,
      },
      where: Object.fromEntries(
        Object.entries({ userId }).filter((_, value) => value !== undefined)
      ),
    });
  }

  async findOne(id: string) {
    const user = await this.prismaService.userChannel.findUnique({
      where: { id },
      include: {
        user: true,
        category: true,
      },
    });
    if (!user) {
      throw new NotFoundException('', 'User does not exist');
    }
    return user;
  }

  update(id: string, updateUserChannelDto: UpdateUserChannelDto) {
    return this.prismaService.userChannel.update({
      where: { id },
      data: {
        ...updateUserChannelDto,
        channelsToRewrite: JSON.stringify(
          updateUserChannelDto.channelsToRewrite
        ),
      },
    });
  }

  remove(id: string) {
    return this.prismaService.userChannel.delete({
      where: { id },
    });
  }
}
