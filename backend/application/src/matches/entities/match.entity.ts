import { ApiProperty } from '@nestjs/swagger';
import { MapType, Match, MatchType } from '@prisma/client';

export class MatchEntity implements Match {
  @ApiProperty()
  id: number;

  @ApiProperty()
  type: MatchType;

  @ApiProperty()
  mapType: MapType;

  @ApiProperty()
  matchAt: Date;

  @ApiProperty()
  winnerId: number;

  @ApiProperty()
  loserId: number;
}
