import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TwoFactorAuthenticationCodeDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	twoFactorAuthenticationCode: string;
}
