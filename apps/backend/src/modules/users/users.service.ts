import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {

  constructor(private readonly prismaService: PrismaService) {
  }


/*  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }*/

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: string) {
    const user = await this.prismaService.user.findUnique(
      { where: { id } },
    )

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

/*  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }*/

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
