import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { AuthGuard } from './guards/auth.guard';
import { RegisterAuthDto } from './dto/register-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() dto: LoginAuthDto) {
    return this.authService.login(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('register')
  register(@Body() dto: RegisterAuthDto) {
    return this.authService.register(dto);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req: Express.Request & { user: any }) {
    return req.user;
  }
}
