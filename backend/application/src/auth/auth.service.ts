import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { Response } from 'express';
import { authenticator } from 'otplib';
import { toFileStream } from 'qrcode';
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
			isSecondFactorAuthenticated: false,
		};
		return this.jwtService.sign(payload, { expiresIn: '15m' });
	}

	signTwoFactor(user: User) {
		const payload = {
			sub: this.configService.get<string>('JWT_DB_SUB'),
			user: user,
			isSecondFactorAuthenticated: true,
		};
		return this.jwtService.sign(payload, { expiresIn: '15m' });
	}

	isTwoFactorAuthenticationCodeValid(
		twoFactorAuthenticationCode: string,
		user: User,
	) {
		return authenticator.verify({
			token: twoFactorAuthenticationCode,
			secret: user.twoFactorAuthenticationSecret,
		});
	}

	async generateTwoFactorAuthenticationSecret(
		userId: number,
		nickname: string,
	) {
		const secret = authenticator.generateSecret();

		const otpauthUrl = authenticator.keyuri(
			nickname,
			this.configService.get<string>('TWO_FACTOR_AUTHENTICATION_APP_NAME'),
			secret,
		);

		await this.usersService.setTwoFactorAuthenticationSecret(secret, userId);

		return {
			secret,
			otpauthUrl,
		};
	}

	async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
		return await toFileStream(stream, otpauthUrl);
	}
}
