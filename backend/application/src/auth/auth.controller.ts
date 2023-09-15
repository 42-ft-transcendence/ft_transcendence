import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { Response } from 'express';
import { AuthService } from './auth.service';
import {
	FourtyTwoAuthGuard,
	JwtAuthGuard,
	JwtTwoFactorAuthGuard,
} from './guards';
import { CurrentUser, UserPropertyString, ValidateOtpGuard } from 'src/common';
import { UsersService } from 'src/users/users.service';

@Controller('/')
export class AuthController {
	constructor(
		private authService: AuthService,
		private usersService: UsersService,
	) {}

	@Get('oauth/42')
	@UseGuards(FourtyTwoAuthGuard)
	oauth() {
		// initiates the 42 OAuth2 login flow
	}

	@Get('oauth/42/redirect')
	@UseGuards(FourtyTwoAuthGuard)
	async redirect(@Req() req: any, @Res() res: Response) {
		const user = req.user;

		if (user.isNewUser) {
			res.cookie('JWTOAuth', this.authService.signOauth(user), {
				expires: new Date(Date.now() + 15 * 60 * 1000),
			});
			res.redirect('http://localhost:8080/signup');
		} else {
			res.cookie('JWTDatabase', this.authService.signDatabase(user), {
				expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
			});
			res.redirect('http://localhost:8080/');
		}
	}

	@Post('auth/otp/generate')
	@UseGuards(JwtAuthGuard)
	async register(
		@CurrentUser(UserPropertyString.ID) id: number,
		@CurrentUser(UserPropertyString.NICKNAME) nickname: string,
	) {
		return await this.authService.generateOtpSecret(id, nickname);
	}

	@Post('auth/otp/authenticate')
	@UseGuards(JwtAuthGuard, ValidateOtpGuard)
	async authenticate(@CurrentUser() user: User, @Res() response: Response) {
		response.cookie('JWTDatabase', this.authService.signTwoFactor(user), {
			expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
		});
		response.status(201).send({ authenticated: true });
	}

	@Post('auth/otp/enable') //TODO: 2단계 인증이 허용되었고, 인증이 되어있는 상태에서만 해당 핸들러에 접근할 수 있게 하기?
	@UseGuards(JwtTwoFactorAuthGuard, ValidateOtpGuard)
	async enableTwoFactorAuthentication(
		@CurrentUser() user: User,
		@Res() response: Response,
	) {
		const processed = await this.usersService.switchTwoFactorAuthentication(
			user.id,
			true,
		);
		response.cookie('JWTDatabase', this.authService.signTwoFactor(processed), {
			expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
		});
		response.status(201).send({ authenticated: true });
	}

	@Post('auth/otp/disable') //TODO: 2단계 인증이 허용되었고, 인증이 되어있는 상태에서만 해당 핸들러에 접근할 수 있게 하기?
	@UseGuards(JwtTwoFactorAuthGuard, ValidateOtpGuard)
	async disableTwoFactorAuthentication(
		@CurrentUser() user: User,
		@Res() response: Response,
	) {
		const processed = await this.usersService.switchTwoFactorAuthentication(
			user.id,
			false,
		);
		response.cookie('JWTDatabase', this.authService.signDatabase(processed), {
			expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
		});
		response.status(201).send({ authenticated: false });
	}
}
