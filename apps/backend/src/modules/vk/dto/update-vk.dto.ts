import { PartialType } from '@nestjs/mapped-types';
import { CreateVkDto } from './create-vk.dto';

export class UpdateVkDto extends PartialType(CreateVkDto) {}
