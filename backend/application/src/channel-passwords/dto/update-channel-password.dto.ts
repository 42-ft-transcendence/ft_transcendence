import { ApiProperty } from '@nestjs/swagger';
import { IsByteLength, Length, IsNotEmpty, IsString } from 'class-validator';

export class UpdateChannelPasswordDto {
  @IsByteLength(0, 72)
  @Length(4, 20)
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ minLength: 4, maxLength: 20 })
  password: string;
}
