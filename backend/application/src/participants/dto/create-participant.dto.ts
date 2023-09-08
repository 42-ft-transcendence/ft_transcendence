import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
	IsByteLength,
	IsNotEmpty,
	IsOptional,
	IsPositive,
	IsString,
	Length,
} from 'class-validator';

export class CreateParticipantDto {
	@IsPositive()
	@IsNotEmpty()
	@ApiProperty()
	channelId: number;

	@IsByteLength(0, 72)
	@Length(4, 20)
	@IsString()
	@IsNotEmpty()
	@IsOptional()
	@ApiProperty({ minLength: 4, maxLength: 20 })
	channelPassword?: string;
}
