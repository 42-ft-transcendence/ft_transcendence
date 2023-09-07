import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FourtyTwoAuthGuard } from './guards/fourty-two-auth.guard';
import { Response } from 'express';

@Controller('oauth/42')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Get()
	@UseGuards(FourtyTwoAuthGuard)
	oauth() {
		// initiates the 42 OAuth2 login flow
	}

	@Get('redirect')
	@UseGuards(FourtyTwoAuthGuard)
	async redirect(@Req() req: any, @Res() res: Response) {
		const user = req.user;

		if (user.isNewUser) {
			res.cookie('JWTOAuth', this.authService.signOauth(user), {
				maxAge: 30 * 60 * 1000,
			});
			res.redirect('http://localhost:8080/signup');
		} else {
			res.cookie('JWTDatabase', this.authService.signDatabase(user), {
				maxAge: 24 * 60 * 60 * 1000,
			});
			res.redirect('http://localhost:8080/');
		}
	}
}
