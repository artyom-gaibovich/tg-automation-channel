import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { ConfigService } from '@nestjs/config';
import { LoginAuthDto } from './dto/login-auth.dto';
import { withLogging } from '../messages/infrastructure/decorators/logger';

@withLogging
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private prismaService: PrismaService,
    private configService: ConfigService
  ) {}

  async login(loginDto: LoginAuthDto): Promise<{ access_token: string }> {
    const { email, password } = loginDto;
    const user = await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) throw new BadRequestException('User does not exist');

    const passwordMatches = await argon2.verify(user.passwordHash, password);
    if (!passwordMatches)
      throw new BadRequestException('Password is incorrect');

    const payload = { id: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '60m',
      }),
    };
  }

  async register({ email, password }: RegisterAuthDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (user) throw new BadRequestException('User already exist');

    const passwordHash = await argon2.hash(password);
    const newUser = await this.prismaService.user.create({
      data: {
        passwordHash,
        email,
      },
    });
    const [accessToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          id: newUser.id,
          email: newUser.email,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '60m',
        }
      ),
    ]);

    return {
      accessToken,
    };
  }
}
