import { ApiProperty } from '@nestjs/swagger';
import { Ladder } from '@prisma/client';

export class UserEntity {
	@ApiProperty()
	id: number;

	@ApiProperty()
	fourtyTwoId: number;

	@ApiProperty()
	twoFactorAuthenticationSecret?: string;

	@ApiProperty()
	isTwoFactorAuthenticationEnabled: boolean;

	@ApiProperty()
	avatar: string;

	@ApiProperty({ maxLength: 10 })
	nickname: string;

	@ApiProperty({ default: 0 })
	winCount: number;

	@ApiProperty({ default: 0 })
	loseCount: number;

	@ApiProperty({ enum: Ladder, default: Ladder.BRONZE })
	ladder: Ladder;

	@ApiProperty()
	createdAt: Date;

	@ApiProperty()
	updatedAt: Date;
}
