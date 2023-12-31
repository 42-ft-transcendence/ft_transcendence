import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive, IsString, Length, NotContains } from 'class-validator';

export class CreateUserDto {
  @Length(3, 10)
  @NotContains(',')
  @NotContains(' ')
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  nickname: string;

  @IsPositive() //TODO: 42 api의 id가 0부터 시작하는지 1부터 시작하는지 알아야 함
  @IsNotEmpty()
  @ApiProperty()
  fourtyTwoId: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  avatar: string;
}
