import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { FourtyTwoStrategy } from './strategies/fourty-two.strategy';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/common';
import { JwtTwoFactorAuthGuard } from './guards';
import { JwtTwoFactorStrategy } from './strategies/jwt-two-factor.strategy';

@Module({
	controllers: [AuthController],
	providers: [
		UsersService,
		PrismaService,
		AuthService,
		FourtyTwoStrategy,
		JwtStrategy,
		JwtAuthGuard,
		JwtTwoFactorStrategy,
		JwtTwoFactorAuthGuard,
	],
	imports: [
		PassportModule,
		JwtModule.registerAsync({
			useFactory: async (configService: ConfigService) => ({
				secret: configService.get<string>('JWT_SECRET_KEY'),
				signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') },
			}),
			inject: [ConfigService],
		}),
	],
	exports: [JwtModule],
})
export class AuthModule {}
