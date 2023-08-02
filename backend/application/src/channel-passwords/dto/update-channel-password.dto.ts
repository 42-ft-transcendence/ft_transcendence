import { PartialType } from '@nestjs/swagger';
import { CreateChannelPasswordDto } from './create-channel-password.dto';

export class UpdateChannelPasswordDto extends PartialType(
  CreateChannelPasswordDto,
) {}
