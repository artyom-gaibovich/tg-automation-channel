import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AppConfigService } from '../shared/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      useFactory: (appConfigService: AppConfigService) => ({
        signOptions: { expiresIn: '60m' },
        secret: appConfigService.jwtAccessSecret,
      }),
      inject: [AppConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
