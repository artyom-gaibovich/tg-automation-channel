import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { IAppConfig } from './config.interface';

@Injectable()
export class AppConfigService implements IAppConfig {
  constructor(private readonly configService: ConfigService) {}

  private get cfg(): IAppConfig {
    return <IAppConfig>this.configService.get<IAppConfig>('config-namespace');
  }

  get port(): number {
    return this.cfg.port;
  }

  get jwtAccessSecret(): string {
    return this.cfg.jwtAccessSecret;
  }
}
