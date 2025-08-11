import { Module } from '@nestjs/common';
import { UserChannelsService } from './user-channels.service';
import { UserChannelsController } from './user-channels.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UserChannelsController],
  providers: [UserChannelsService],
  exports: [UserChannelsService],
})
export class  UserChannelsModule {}
