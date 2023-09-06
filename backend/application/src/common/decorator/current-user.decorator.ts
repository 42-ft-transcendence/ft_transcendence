import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { UserExtendedRequest } from '../type';

export const CurrentUser = createParamDecorator(
	(propertyName: string, ctx: ExecutionContext) => {
		const user = ctx.switchToHttp().getRequest<UserExtendedRequest>().user;
		if (!user) {
			return null;
		}
		return propertyName ? user[propertyName] : user;
	},
);
