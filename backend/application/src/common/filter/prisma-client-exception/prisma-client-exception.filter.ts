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
          message: `${exception.meta.target} field should be unique`,
          error: 'Conflict',
          statusCode: HttpStatus.CONFLICT,
        });
      case 'P2025': // not found
        response.status(HttpStatus.NOT_FOUND).json({
          message: exception.message,
          error: exception.name,
          statusCode: HttpStatus.NOT_FOUND,
        });
      default:
        super.catch(exception, host);
    }
  }
}
