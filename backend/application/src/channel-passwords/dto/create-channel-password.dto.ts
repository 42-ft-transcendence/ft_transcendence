import { ApiProperty } from '@nestjs/swagger';
import {
  IsByteLength,
  IsNotEmpty,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';

export class CreateChannelPasswordDto {
  @IsByteLength(0, 72) // for bcrypt
  @Length(4, 20)
  @IsString() // 사실상 필요 없지만 에러 메시지 출력에서 문자열임을 표현하려면 있는 게 좋다
  @IsNotEmpty()
  @ApiProperty({ minLength: 4, maxLength: 20 })
  password: string;

  @IsPositive()
  @IsNotEmpty()
  @ApiProperty()
  channelId: number;
}
