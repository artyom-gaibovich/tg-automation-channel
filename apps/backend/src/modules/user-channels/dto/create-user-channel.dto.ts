import { ArrayMaxSize, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserChannelDto {
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsString()
  @IsNotEmpty()
  telegramId!: string;


  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsNotEmpty()
  @IsString()
  categoryId: string;

  @IsArray()
  @ArrayMaxSize(100)
  @IsString({ each: true })
  channelsToRewrite!: string[];
}
