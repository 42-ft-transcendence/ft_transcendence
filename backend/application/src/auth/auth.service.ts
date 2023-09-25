import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { authenticator } from 'otplib';
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
		return this.jwtService.sign(payload, {
			expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
		});
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
		return this.jwtService.sign(payload, {
			expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
		});
	}

	isOtpValid(otp: string, user: User) {
		return authenticator.verify({
			token: otp,
			secret: user.otpSecret,
		});
	}

	async generateOtpSecret(userId: number, nickname: string) {
		const secret = authenticator.generateSecret();
		const otpauthUrl = authenticator.keyuri(
			nickname,
			this.configService.get<string>('TWO_FACTOR_AUTHENTICATION_APP_NAME'),
			secret,
		);

		await this.usersService.setOtpSecret(secret, userId);
		return { secret, otpauthUrl };
	}

	// async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
	// 	return await toFileStream(stream, otpauthUrl);
	// }
}
