import { PartialType } from '@nestjs/swagger';
import { CreateChannelDto } from '.';

export class UpdateChannelDto extends PartialType(CreateChannelDto) {}
