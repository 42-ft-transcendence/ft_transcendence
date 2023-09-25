import { ApiProperty } from '@nestjs/swagger';
import {
	IsNotEmpty,
	IsOptional,
	IsString,
	Length,
	NotContains,
} from 'class-validator';

export class CreateCustomUserDto {
	@Length(3, 10, { message: '닉네임은 최소 3 글자, 최대 10글자여야 합니다.' })
	@NotContains(',', { message: '닉네임에는 ","나 공백을 포함할 수 없습니다.' })
	@NotContains(' ', { message: '닉네임에는 ","나 공백을 포함할 수 없습니다.' })
	@IsString()
	@IsNotEmpty()
	@IsOptional()
	@ApiProperty()
	nickname?: string;
}
