import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    /*await this.user.create({
      data: {
        id: '71b553fe-a1f6-4833-a158-0e10d2d2aed4',
        passwordHash:
          '$argon2id$v=19$m=65536,t=3,p=4$xZacO/hsqmjXTgGdHB+3FA$2SRU9UAQBjjw8dESTT359YExBHKKqgaO4TIQT3nQZdo',
        email: 'test@gmail.com',
      },
    });*/
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
