import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { AuthService } from './auth.service';

@Injectable()
export class FourtyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('OAUTH_42_ID'),
      clientSecret: configService.get<string>('OAUTH_42_SECRET'),
      callbackURL: configService.get<string>('OAUTH_42_REDIRECT_URL'),
      // profileFields: {}, TODO: https://api.intra.42.fr/apidoc/2.0/users/show.html
      passReqToCallback: true,
    });
  }

  // NestJS-way of function "verify"
  async validate(req, accessToken, refreshToken, profile, cb) {
    // req.session.accessToken = accessToken;
    const user = await this.authService.validateUser(profile._json.id);
    if (user) {
      return cb(null, profile);
    } else {
      //TOOD: nickname, avatar 등 지정하고 가입하는 과정 필요


      console.log(profile)
      return cb(null, profile);
    }
  }
}