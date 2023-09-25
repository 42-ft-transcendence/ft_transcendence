import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpStatus,
	UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(UnauthorizedException)
export class TwoFactorExceptionFilter implements ExceptionFilter {
	catch(exception: UnauthorizedException, host: ArgumentsHost) {
		host
			.switchToHttp()
			.getResponse<Response>()
			.status(HttpStatus.OK)
			.json({ refresh: true });
	}
}
