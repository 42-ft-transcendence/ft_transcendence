import { ApiProperty } from '@nestjs/swagger';
import {
	IsNotEmpty,
	IsOptional,
	IsString,
	Length,
	NotContains,
} from 'class-validator';

export class CreateCustomUserDto {
	@Length(3, 10)
	@NotContains(',')
	@NotContains(' ')
	@IsString()
	@IsNotEmpty()
	@IsOptional()
	@ApiProperty()
	nickname?: string;
}
