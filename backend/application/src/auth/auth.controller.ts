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
  async redirect(@Req() req, @Res() res: Response) {
    res.cookie('JsonWebToken', this.authService.issueJwt(req.user), {
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.redirect('http://localhost:8080/');
  }
}