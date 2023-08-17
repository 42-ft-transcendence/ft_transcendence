import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export const CurrentUser = createParamDecorator(
	(propertyName: string, ctx: ExecutionContext) => {
		const user = ctx.switchToHttp().getRequest().user;
		if (!user) {
			return null;
		}
		return propertyName ? user[propertyName] : user;
	}
);