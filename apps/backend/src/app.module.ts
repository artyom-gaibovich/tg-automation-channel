import { Module } from '@nestjs/common';
import { CategoriesModule } from './modules/categories/categories.module';
import { UsersModule } from './modules/users/users.module';
import { UserChannelsModule } from './modules/user-channels/user-channels.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { MessagesModule } from './modules/messages/messages.module';
import { YoutubeModule } from './modules/youtube/youtube.module';
import { TranscriptionModule } from './modules/transcription/transcription.module';
import { SharedModule } from './modules/shared/shared.module';
import { ScenarioModule } from './modules/scenario/scenario.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    CategoriesModule,
    MessagesModule,
    ScenarioModule,
    UsersModule,
    SharedModule.register({
      type: 'prisma',
      global: true,
    }),
    UserChannelsModule,
    TranscriptionModule,
    YoutubeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
