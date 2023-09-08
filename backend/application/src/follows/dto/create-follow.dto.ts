import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive } from 'class-validator';

export class CreateFollowDto {
	// @IsPositive()
	// @IsNotEmpty()
	// @ApiProperty()
	// followerId: number;

	@IsPositive()
	@IsNotEmpty()
	@ApiProperty()
	followeeId: number;
}
