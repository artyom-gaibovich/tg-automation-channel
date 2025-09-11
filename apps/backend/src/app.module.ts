import { Module } from '@nestjs/common';
import { CategoriesModule } from './modules/categories/categories.module';
import { UsersModule } from './modules/users/users.module';
import { UserChannelsModule } from './modules/user-channels/user-channels.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { MessagesModule } from './modules/messages/messages.module';
import { YoutubeModule } from './modules/youtube/youtube.module';
import { VkModule } from './modules/vk/vk.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    CategoriesModule,
    MessagesModule,
    UsersModule,
    UserChannelsModule,
    YoutubeModule,
    VkModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
