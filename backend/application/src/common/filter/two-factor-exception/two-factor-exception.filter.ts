import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(UnauthorizedException)
export class TwoFactorExceptionFilter implements ExceptionFilter {
	catch(exception: UnauthorizedException, host: ArgumentsHost) {
		host
			.switchToHttp()
			.getResponse<Response>()
			.status(200)
			.json({ refresh: true });
	}
}
