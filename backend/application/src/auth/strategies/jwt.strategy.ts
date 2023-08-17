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
			return await this.usersService.findOne(payload.sub);
		} catch (err) {
			throw new UnauthorizedException();
		}
	}
}
