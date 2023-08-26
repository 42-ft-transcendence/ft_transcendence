import { ApiProperty } from '@nestjs/swagger';
import { Length, IsString, IsNotEmpty } from 'class-validator';

export class UpdateUserProfileDto {
  @Length(3, 10)
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  nickname: string;
}