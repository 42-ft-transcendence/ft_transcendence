import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FourtyTwoAuthGuard } from './fourty-two-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('42/login')
  @UseGuards(FourtyTwoAuthGuard)
  login() {
    // initiates the 42 OAuth2 login flow
  }

  @Get('42/redirect')
  @UseGuards(FourtyTwoAuthGuard)
  async redirect(@Req() req) {
    return this.authService.login(req.user);
    // console.log(req.user);

    // const jwt: string = req.user.jwt;
    // if (jwt) res.redirect('http://localhost:8080/login/success/' + jwt);
    // else res.redirect('http://localhost:8080/login/failure/');
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async profile() {
    return 'JWT is working!';
  }
}
