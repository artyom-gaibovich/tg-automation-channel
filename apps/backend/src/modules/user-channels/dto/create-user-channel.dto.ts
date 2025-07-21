import { IsOptional, IsString } from 'class-validator';

export class CreateUserChannelDto {
  @IsString()
  telegramId: string;

  @IsString()
  title: string;

  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  channelsToRewrite?: string;
}
