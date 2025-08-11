import { IsUrl, IsUUID } from 'class-validator';

export class GetCommentsDto {
  @IsUrl()
  videoUrl: string;

  @IsUUID()
  categoryId: string;
}
