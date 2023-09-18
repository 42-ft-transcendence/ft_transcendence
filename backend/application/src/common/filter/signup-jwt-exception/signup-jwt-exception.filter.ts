import {
	ArgumentsHost,
	BadRequestException,
	Catch,
	ExceptionFilter,
	HttpException,
	HttpStatus,
	UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(UnauthorizedException)
export class SignupJwtExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const response = host.switchToHttp().getResponse<Response>();

		response.status(HttpStatus.UNAUTHORIZED).json({
			message: '유효 시간이 지났습니다. 새로고침 후 다시 시도해주세요.',
			error: exception.name,
			statusCode: HttpStatus.UNAUTHORIZED,
		});
	}
}
