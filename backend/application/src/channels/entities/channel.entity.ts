import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { Channel, ChannelType } from '@prisma/client';

export class ChannelEntity implements Channel {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ enum: ChannelType, default: ChannelType.PUBLIC })
  type: ChannelType;

  @ApiProperty()
  ownerId: number;

  @ApiProperty()
  createdAt: Date;
}
