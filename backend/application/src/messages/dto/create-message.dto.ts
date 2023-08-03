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
// -> 던져준다. P2003. foreign key constraint fail error. 참조하는 테이블의 컬럼 값으로 존재하지 않는 값을 외래 키의 값으로 사용할 때 발생하는 에러.
// 클라이언트는 500 internal server error를 받는다.
