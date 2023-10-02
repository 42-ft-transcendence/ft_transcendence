import { ApiProperty } from '@nestjs/swagger';
import { ChannelType } from '@prisma/client';
import {
	IsByteLength,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsPositive,
	IsString,
	Length,
	MinLength,
	NotContains,
} from 'class-validator';
import { HasPassword } from 'src/common';

export class CreateChannelDto {
	@Length(3, 10, {
		message: '채널의 제목은 최소 3글자, 최대 10글자여야 합니다.',
	})
	@NotContains(',', { message: "채널의 제목으로 ','를 사용할 수 없습니다." })
	@NotContains(' ', { message: '채널의 제목으로 공백을 사용할 수 없습니다.' })
	@IsString()
	@IsNotEmpty({ message: '채널 제목은 필수 입력값입니다.' })
	@ApiProperty()
	name: string;

	@HasPassword({
		message(validationArguments) {
			return validationArguments.value === ChannelType.PROTECTED
				? `$value 채널에는 비밀번호가 필요합니다.`
				: `$value 채널에는 비밀번호가 없어야 합니다.`;
		},
	})
	@IsEnum(ChannelType)
	@IsNotEmpty()
	@ApiProperty({ enum: ChannelType, default: ChannelType.PUBLIC })
	type: ChannelType;

	// @IsPositive()
	// @IsNotEmpty()
	// @ApiProperty()
	// ownerId: number;

	@IsByteLength(0, 72, { message: '비밀번호는 72 바이트를 넘길 수 없습니다.' })
	@Length(4, 20, { message: '비밀번호는 최소 4글자, 최대 20글자여야 합니다.' })
	@IsString()
	@IsNotEmpty()
	@IsOptional()
	@ApiProperty({ required: false, minLength: 4, maxLength: 20 })
	password?: string;
}
