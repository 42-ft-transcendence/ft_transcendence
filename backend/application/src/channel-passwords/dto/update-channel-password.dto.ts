import { PartialType } from '@nestjs/swagger';
import { CreateChannelPasswordDto } from '.';

export class UpdateChannelPasswordDto extends PartialType(
  CreateChannelPasswordDto,
) {}
