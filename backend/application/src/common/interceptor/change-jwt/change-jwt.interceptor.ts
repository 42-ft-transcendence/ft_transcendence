import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { Response } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable()
export class ChangeJwtInterceptor implements NestInterceptor {
	constructor(
		private jwtService: JwtService,
		private configService: ConfigService,
	) {}
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		return next.handle().pipe(
			tap({
				next: (value: User) => {
					const response = context.switchToHttp().getResponse<Response>();
					const payload = {
						sub: this.configService.get<string>('JWT_DB_SUB'),
						user: value,
					};
					response.clearCookie('JWTOAuth');
					response.cookie('JWTDatabase', this.jwtService.sign(payload));
				},
			}),
		);
	}
}
