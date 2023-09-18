import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Observable, tap } from 'rxjs';

@Injectable()
export class PrismaInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		return next.handle().pipe(
			tap({
				error: (err: Prisma.PrismaClientKnownRequestError) => {
					switch ((err.meta?.target as Array<string>).at(0)) {
						case 'nickname':
							err.meta.target = '닉네임';
							throw err;
							break;
						case 'fourty_two_id':
							err.code = 'MakeThis500Error'; //TODO: invalid prisma error code to make this error as 500 error
						default:
							throw err;
							break;
					}
				},
			}),
		);
	}
}
