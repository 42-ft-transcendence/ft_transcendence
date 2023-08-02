import { ApiProperty } from '@nestjs/swagger';
import { ChannelPassword } from '@prisma/client';

export class ChannelPasswordEntity implements ChannelPassword {
  @ApiProperty()
  id: number;

  @ApiProperty({ minLength: 4, maxLength: 20 })
  password: string;

  @ApiProperty()
  channelId: number;
}
