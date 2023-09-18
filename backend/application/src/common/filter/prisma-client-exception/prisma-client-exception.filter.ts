import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
	catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
		const response = host.switchToHttp().getResponse<Response>();

		switch (exception.code) {
			case 'P2002': // unique constraints
				response.status(HttpStatus.CONFLICT).json({
					message: `중복된 ${exception.meta.target}을 사용할 수 없습니다.`,
					error: 'Conflict',
					statusCode: HttpStatus.CONFLICT,
				});
				break;
			case 'P2025': // not found
				response.status(HttpStatus.NOT_FOUND).json({
					message: exception.message, //TODO: exception.meta.target을 활용해 ~를 찾을 수 없습니다. 라는 메시지를 출력하게 구현하기
					error: exception.name,
					statusCode: HttpStatus.NOT_FOUND,
				});
				break;
			default:
				super.catch(exception, host);
				break;
		}
	}
}
