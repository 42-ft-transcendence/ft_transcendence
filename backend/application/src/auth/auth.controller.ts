import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  @UseGuards(AuthGuard('42'))
  @Get('42/login')
  async login() { }

  @UseGuards(AuthGuard('42'))
  @Get('42/callback')
  async redirect() {
    console.log("redirected page")
  }
}
