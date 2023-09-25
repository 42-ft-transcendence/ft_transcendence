import {
	BadRequestException,
	CanActivate,
	ExecutionContext,
	Injectable,
} from '@nestjs/common';
import { authenticator } from 'otplib';
import { UserExtendedRequest } from 'src/common/type';

@Injectable()
export class ValidateOtpGuard implements CanActivate {
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<UserExtendedRequest>();
		const user = request.user;
		const { otpCode } = request.body;

		if (!authenticator.check(otpCode, user.otpSecret))
			throw new BadRequestException('유효하지 않은 코드입니다.');
		return true;
	}
}
