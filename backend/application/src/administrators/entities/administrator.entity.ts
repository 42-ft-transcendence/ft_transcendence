import { ApiProperty } from '@nestjs/swagger';
import { Administrator } from '@prisma/client';

export class AdministratorEntity implements Administrator {
  @ApiProperty()
  id: number;

  @ApiProperty()
  channelId: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  createdAt: Date;
}
