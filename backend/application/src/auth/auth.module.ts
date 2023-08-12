import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { FourtyTwoStrategy } from './fourty-two.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [UsersModule, PassportModule],
  providers: [AuthService, FourtyTwoStrategy],
  controllers: [AuthController]
})
export class AuthModule { }
