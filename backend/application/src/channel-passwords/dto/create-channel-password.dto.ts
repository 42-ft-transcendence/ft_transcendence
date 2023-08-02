import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive, IsString, Length } from 'class-validator';

export class CreateChannelPasswordDto {
  @Length(4, 20)
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ minLength: 4, maxLength: 20 })
  password: string;

  @IsPositive()
  @IsNotEmpty()
  @ApiProperty()
  channelId: number;
}
