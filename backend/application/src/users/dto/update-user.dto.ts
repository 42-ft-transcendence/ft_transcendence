import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { Ladder } from '@prisma/client';
import { IsEnum, IsNumber, Min } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsNumber()
  @Min(0)
  @ApiProperty({ required: false })
  winCount?: number;

  @IsNumber()
  @Min(0)
  @ApiProperty({ required: false })
  loseCount?: number;

  @IsEnum(Ladder)
  @ApiProperty({ enum: Ladder, enumName: 'Ladder', required: false })
  ladder?: Ladder;
}
