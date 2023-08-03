import { ApiProperty } from '@nestjs/swagger';
import { Ban } from '@prisma/client';

export class BanEntity implements Ban {
  @ApiProperty()
  id: number;

  @ApiProperty()
  channelId: number;

  @ApiProperty()
  userId: number;
}
