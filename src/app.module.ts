import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { FilesModule } from './modules/files/files.module';
import { TranscriptionModule } from './modules/transcription/transcription.module';
import { SharedModule } from './modules/shared/shared.module';
import { ScenarioModule } from './modules/scenario/scenario.module';
import { CategoryModule } from './modules/category/category.module';
import { AppConfigModule } from './modules/shared/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AppConfigModule,
    AuthModule,
    CategoryModule,
    ScenarioModule,
    SharedModule.register({
      type: 'prisma',
      global: true,
    }),
    TranscriptionModule,
    FilesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}