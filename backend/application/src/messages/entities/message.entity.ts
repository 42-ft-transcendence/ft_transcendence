import { ApiProperty } from '@nestjs/swagger';
import { Message } from '@prisma/client';

export class MessageEntity implements Message {
  @ApiProperty()
  id: number;

  @ApiProperty()
  content: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  channelId: number;

  @ApiProperty()
  senderId: number;
}
