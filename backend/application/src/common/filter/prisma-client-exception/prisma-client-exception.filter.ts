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
				console.error(exception);
				response.status(HttpStatus.CONFLICT).json({
					message: `중복된 ${
						exception.meta?.target ? exception.meta.target : '값'
					}을 사용할 수 없습니다.`,
					error: 'Conflict',
					statusCode: HttpStatus.CONFLICT,
				});
				break;
			case 'P2003': // foreign key constraints
			case 'P2025': // not found
				console.error(exception);
				response.status(HttpStatus.NOT_FOUND).json({
					// message: '존재하지 않는 자원에 대한 요청입니다.',
					message: undefined,
					error: 'Not Found',
					statusCode: HttpStatus.NOT_FOUND,
				});
				break;
			case 'P2028':
			case 'P2034':
			case 'P5015':
			case 'P6005':
				console.error(exception);
				response.status(HttpStatus.CONFLICT).json({
					message: undefined,
					error: 'Conflict',
					statusCode: HttpStatus.CONFLICT,
				});
			default:
				// super.catch(exception, host);
				console.error(exception);
				response.status(HttpStatus.BAD_REQUEST).json({
					// message: '유효하지 않은 요청입니다.',
					message: undefined,
					error: 'Bad Request',
					statusCode: HttpStatus.BAD_REQUEST,
				});
				break;
		}
	}
}
