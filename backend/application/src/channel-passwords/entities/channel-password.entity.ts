import { ApiProperty } from '@nestjs/swagger';
import { ChannelPassword } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class ChannelPasswordEntity implements ChannelPassword {
  constructor(partial: Partial<ChannelPasswordEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @Exclude()
  @ApiProperty({ minLength: 4, maxLength: 20 })
  password: string;

  @ApiProperty()
  channelId: number;
}
