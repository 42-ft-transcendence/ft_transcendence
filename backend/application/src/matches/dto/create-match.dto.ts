import { ApiProperty } from '@nestjs/swagger';
import { MatchType, MapType } from '@prisma/client';
import { IsDate, IsEnum, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateMatchDto {
  @IsEnum(MatchType)
  @IsNotEmpty()
  @ApiProperty()
  type: MatchType;

  @IsEnum(MapType)
  @IsNotEmpty()
  @ApiProperty()
  mapType: MapType;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty()
  matchAt: Date;

  @IsPositive()
  @IsNotEmpty()
  @ApiProperty()
  winnerId: number;

  @IsPositive()
  @IsNotEmpty()
  @ApiProperty()
  loserId: number;
}
