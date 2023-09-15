import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class OtpCodeDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	otpCode: string;
}
