import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
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
		try {
			if (payload.sub === this.configService.get<string>('JWT_DB_SUB'))
				return await this.usersService.findOne(payload.user.id);
			else if (payload.sub === this.configService.get<string>('JWT_OAUTH_SUB'))
				return payload.user;
			else throw new UnauthorizedException({});
		} catch (err) {
			throw new UnauthorizedException({});
		}
	}
}
