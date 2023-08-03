import { ApiProperty } from '@nestjs/swagger';
import { IsPositive, IsNotEmpty } from 'class-validator';

export class CreateBanDto {
  @IsPositive()
  @IsNotEmpty()
  @ApiProperty()
  channelId: number;

  @IsPositive()
  @IsNotEmpty()
  @ApiProperty()
  userId: number;
}
