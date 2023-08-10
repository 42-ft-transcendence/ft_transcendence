import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Ladder } from '@prisma/client';
import { IsEnum, IsNumber, Min } from 'class-validator';
import { CreateUserDto } from '.';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @Min(0)
  @IsNumber()
  @ApiProperty({ required: false })
  winCount?: number;

  @Min(0)
  @IsNumber()
  @ApiProperty({ required: false })
  loseCount?: number;

  @IsEnum(Ladder)
  @ApiProperty({ enum: Ladder, enumName: 'Ladder', required: false })
  ladder?: Ladder;
}
