import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfigService } from './config.service';
import { appConfigNs } from './config.ns';

@Global()
@Module({
  imports: [ConfigModule.forFeature(appConfigNs)],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}