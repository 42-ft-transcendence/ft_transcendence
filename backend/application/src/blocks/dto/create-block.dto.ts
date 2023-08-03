import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive } from 'class-validator';

export class CreateBlockDto {
  @IsPositive()
  @IsNotEmpty()
  @ApiProperty()
  blockerId: number;

  @IsPositive()
  @IsNotEmpty()
  @ApiProperty()
  blockeeId: number;
}
