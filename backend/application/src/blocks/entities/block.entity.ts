import { ApiProperty } from '@nestjs/swagger';
import { Block } from '@prisma/client';

export class BlockEntity implements Block {
  @ApiProperty()
  id: number;

  @ApiProperty()
  blockerId: number;

  @ApiProperty()
  blockeeId: number;
}
