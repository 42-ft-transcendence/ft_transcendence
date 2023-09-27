import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientValidationError)
export class PrismaInvalidExceptionFilter implements ExceptionFilter {
	catch(exception: Prisma.PrismaClientValidationError, host: ArgumentsHost) {
		host
			.switchToHttp()
			.getResponse<Response>()
			.status(HttpStatus.BAD_REQUEST)
			.json({
				message: '유효하지 않은 입력입니다.',
				error: 'Bad Request',
				statusCode: HttpStatus.BAD_REQUEST,
			});
	}
}
