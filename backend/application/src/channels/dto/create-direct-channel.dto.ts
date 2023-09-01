import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive, IsString, Length } from 'class-validator';

export class CreateDirectChannelDto {
	// @IsPositive()
	// @IsNotEmpty()
	// @ApiProperty()
	// ownerId: number;

	@IsPositive()
	@IsNotEmpty()
	@ApiProperty()
	interlocatorId: number;

	@Length(3, 10)
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	interlocatorName: string;
}
