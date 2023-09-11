import {
	Body,
	Controller,
	Get,
	HttpCode,
	Post,
	Req,
	Request,
	Res,
	UnauthorizedException,
	UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';
import { FourtyTwoAuthGuard, JwtAuthGuard } from './guards';
import {
	CurrentUser,
	UserExtendedRequest,
	UserPropertyString,
} from 'src/common';
import { UsersService } from 'src/users/users.service';
import { Response } from 'express';
import { TwoFactorAuthenticationCodeDto } from './dto';
import { HttpStatusCode } from 'axios';

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

	@Post('auth/otp/authenticate')
	@UseGuards(JwtAuthGuard)
	async authenticate(
		@Req() request: UserExtendedRequest,
		@Body() { twoFactorAuthenticationCode }: TwoFactorAuthenticationCodeDto,
		@Res() response: Response,
	) {
		const user = request.user;
		const isCodeValid = this.authService.isTwoFactorAuthenticationCodeValid(
			twoFactorAuthenticationCode,
			user,
		);
		if (!isCodeValid) {
			throw new UnauthorizedException('Wrong authentication code');
		}
		response.cookie('JWTDatabase', this.authService.signTwoFactor(user), {
			expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
		});
		response.redirect('http://localhost:8080/');
	}

	@Post('auth/otp/generate')
	@UseGuards(JwtAuthGuard)
	async register(
		@CurrentUser(UserPropertyString.ID) id: number,
		@CurrentUser(UserPropertyString.NICKNAME) nickname: string,
		@Res() response: Response,
	) {
		const { secret, otpauthUrl } =
			await this.authService.generateTwoFactorAuthenticationSecret(
				id,
				nickname,
			);
		console.log(id);
		console.log(nickname);
		console.log(otpauthUrl);
		response.status(201).send(JSON.stringify({ otpauthUrl: otpauthUrl }));
		// return await this.authService.pipeQrCodeStream(response, otpauthUrl);
	}

	@Post('auth/otp/turn-on')
	@UseGuards(JwtAuthGuard)
	async turnOnTwoFactorAuthentication(
		@CurrentUser() user: User,
		@Body() { twoFactorAuthenticationCode }: TwoFactorAuthenticationCodeDto,
	) {
		const isCodeValid = this.authService.isTwoFactorAuthenticationCodeValid(
			twoFactorAuthenticationCode,
			user,
		);

		if (!isCodeValid) {
			throw new UnauthorizedException('Wrong authentication code');
		}
		return await this.usersService.switchTwoFactorAuthentication(user.id, true);
	}

	@Post('auth/otp/turn-off')
	@UseGuards(JwtAuthGuard)
	async turnOffTwoFactorAuthentication(
		@CurrentUser() user: User,
		@Body() { twoFactorAuthenticationCode }: TwoFactorAuthenticationCodeDto,
	) {
		const isCodeValid = this.authService.isTwoFactorAuthenticationCodeValid(
			twoFactorAuthenticationCode,
			user,
		);

		if (!isCodeValid) {
			throw new UnauthorizedException('Wrong authentication code');
		}
		return await this.usersService.switchTwoFactorAuthentication(
			user.id,
			false,
		);
	}
}
