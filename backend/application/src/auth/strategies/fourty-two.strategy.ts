import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { UsersService } from 'src/users/users.service';
import { AuthService } from '../auth.service';

@Injectable()
export class FourtyTwoStrategy extends PassportStrategy(Strategy, '42') {
	constructor(
		private configService: ConfigService,
		private authService: AuthService,
		private usersService: UsersService,
	) {
		super({
			clientID: configService.get<string>('OAUTH_42_ID'),
			clientSecret: configService.get<string>('OAUTH_42_SECRET'),
			callbackURL: configService.get<string>('OAUTH_42_REDIRECT_URL'),
			// profileFields: {}, TODO: https://api.intra.42.fr/apidoc/2.0/users/show.html
			// passReqToCallback: true,
			scope: ['public'],
		});
	}

	// NestJS-way of function "verify"
	async validate(
		// request: any,
		accessToken: string,
		refreshToken: string,
		profile: any,
		cb: any,
	) {
		const fourtyTwoUser = profile._json;
		const databaseUser = await this.authService.validateUser(fourtyTwoUser.id);
		if (databaseUser) {
			return cb(null, databaseUser);
		} else {
			return cb(null, {
				nickname: fourtyTwoUser.login,
				fourtyTwoId: fourtyTwoUser.id,
				avatar: fourtyTwoUser.image.link,
				isNewUser: true,
			});
		}
	}
}
