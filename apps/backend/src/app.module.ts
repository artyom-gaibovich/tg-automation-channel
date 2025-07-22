import { Module } from '@nestjs/common';
import { CategoriesModule } from './modules/categories/categories.module';
import { UsersModule } from './modules/users/users.module';
import { UserChannelsModule } from './modules/user-channels/user-channels.module';
import { TelegramClientModule } from './modules/telegram-client/telegram-client.module';
import { ConfigModule } from '@nestjs/config';
import { MessagesModule } from './modules/messages/messages.module';

@Module({
  imports: [

    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CategoriesModule,
    UsersModule,
    UserChannelsModule,
    MessagesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
