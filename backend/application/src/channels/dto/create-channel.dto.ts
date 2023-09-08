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
	@MinLength(3)
	@NotContains(',')
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	name: string;

	@HasPassword()
	@IsEnum(ChannelType)
	@IsNotEmpty()
	@ApiProperty({ enum: ChannelType, default: ChannelType.PUBLIC })
	type: ChannelType;

	@IsPositive()
	@IsNotEmpty()
	@ApiProperty()
	ownerId: number;

	@IsByteLength(0, 72)
	@Length(4, 20)
	@IsString()
	@IsNotEmpty()
	@IsOptional()
	@ApiProperty({ required: false, minLength: 4, maxLength: 20 })
	password?: string;
}
