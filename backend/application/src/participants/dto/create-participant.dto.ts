import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive } from 'class-validator';

export class CreateParticipantDto {
  @IsPositive()
  @IsNotEmpty()
  @ApiProperty()
  channelId: number;

  @IsPositive()
  @IsNotEmpty()
  @ApiProperty()
  userId: number;
}
