import { ApiProperty } from '@nestjs/swagger';
import { Length, IsString, IsNotEmpty, NotContains } from 'class-validator';

export class UpdateUserProfileDto {
	@Length(3, 10, { message: '닉네임은 최소 3 글자, 최대 10글자여야 합니다.' })
	@NotContains(',', { message: '닉네임에는 ","나 공백을 포함할 수 없습니다.' })
	@NotContains(' ', { message: '닉네임에는 ","나 공백을 포함할 수 없습니다.' })
	@IsString()
	@IsNotEmpty({ message: '닉네임이나 아바타 중 하나는 반드시 입력해야합니다.' })
	@ApiProperty()
	nickname: string;
}
