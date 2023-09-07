import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { FourtyTwoUser } from 'src/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
	constructor(
		private usersService: UsersService,
		private configService: ConfigService,
		private jwtService: JwtService,
	) {}

	async validateUser(fourtyTwoId: number) {
		return await this.usersService.findOneByFourtyTwoId(fourtyTwoId);
	}

	signDatabase(user: User) {
		const payload = {
			sub: this.configService.get<string>('JWT_DB_SUB'),
			user: user,
		};
		return this.jwtService.sign(payload);
	}

	signOauth(user: FourtyTwoUser) {
		const payload = {
			sub: this.configService.get<string>('JWT_OAUTH_SUB'),
			user: user,
		};
		return this.jwtService.sign(payload, { expiresIn: '15m' });
	}
}
