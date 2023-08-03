import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  content: string;

  @IsPositive()
  @IsNotEmpty()
  @ApiProperty()
  channelId: number;

  @IsPositive()
  @IsNotEmpty()
  @ApiProperty()
  senderId: number;
}

//TODO: senderId가 유효한 user id인지 확인, channelId가 유효한 channel id인지 확인하기. prisma가 예외를 던져주나?
