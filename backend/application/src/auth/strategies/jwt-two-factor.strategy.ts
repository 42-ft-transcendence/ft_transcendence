import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtTwoFactorStrategy extends PassportStrategy(
	Strategy,
	'jwt-two-factor',
) {
	constructor(
		private configService: ConfigService,
		private usersService: UsersService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // https://github.com/mikenicholson/passport-jwt#extracting-the-jwt-from-the-request
			secretOrKey: configService.get<string>('JWT_SECRET_KEY'),
		});
	}

	async validate(payload: any) {
		const user = await this.usersService.findOne(payload.user.id);
		try {
			if (!user.isTwoFactorAuthenticationEnabled) return user;
			if (payload.isSecondFactorAuthenticated) return user;
			throw new UnauthorizedException();
		} catch (err) {
			throw new UnauthorizedException();
		}
	}
}
