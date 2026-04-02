import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { YoutubeModule } from './modules/youtube/youtube.module';
import { TranscriptionModule } from './modules/transcription/transcription.module';
import { SharedModule } from './modules/shared/shared.module';
import { ScenarioModule } from './modules/scenario/scenario.module';
import { CategoryModule } from './modules/category/category.module';
import { MessageModule } from './modules/message/message.module';
import { UserModule } from './modules/user/user.module';
import { UserChannelModule } from './modules/user-channel/user-channel.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    CategoryModule,
    ScenarioModule,
    UserModule,
    SharedModule.register({
      type: 'prisma',
      global: true,
    }),
    TranscriptionModule,
    YoutubeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
