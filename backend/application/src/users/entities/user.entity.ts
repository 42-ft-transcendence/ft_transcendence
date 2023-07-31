import { ApiProperty } from '@nestjs/swagger';
import { Ladder, User } from '@prisma/client';

export class UserEntity implements User {
  @ApiProperty()
  id: number;

  @ApiProperty()
  avatar: string;

  @ApiProperty()
  nickname: string;

  @ApiProperty()
  winCount: number;

  @ApiProperty()
  loseCount: number;

  @ApiProperty()
  ladder: Ladder;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
