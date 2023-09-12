import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { UserExtendedRequest } from 'src/common/type';

@Injectable()
export class ValidateOtpGuard implements CanActivate {
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<UserExtendedRequest>();
		const user = request.user;
		const { otpCode } = request.body;

		return authenticator.check(otpCode, user.otpSecret);
	}
}
