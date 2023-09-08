import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export const CurrentUser = createParamDecorator(
	(propertyName: string, ctx: ExecutionContext) => {
		const user = ctx.switchToHttp().getRequest<Request>().user; //JWTOAuth, JWTDatabase 검증 과정에서 설정하는 user 속성의 값이 다르므로 express의 Request 타입을 사용하자.
		if (!user) {
			return null;
		}
		return propertyName ? user[propertyName] : user;
	},
);
