import { PartialType } from '@nestjs/mapped-types';
import { CreateUserChannelDto } from './create-user-channel.dto';

export class UpdateUserChannelDto extends PartialType(CreateUserChannelDto) {}
