import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserExtendedRequest } from 'src/common/type';
/**
 * Guard보다 나중에 실행되는 미들웨어 컴포넌트가 필요해서 아래 기능을 인터셉터로 구현했다.
 *
 * JwtAuthGuard가 실행되면 JwtStrategy가 jwt 토큰을 검증하고, 검증 성공 시 validate 함수가 호출돼 그 반환값이 request 객체에 user 속성으로 저장된다.
 *
 * 아래 인터셉터는 request.user의 id 속성을 request 객체의 body에 전달받은 속성명으로 저장하는 기능을 한다.
 */
@Injectable()
export class AddUserIdToBodyInterceptor implements NestInterceptor {
	constructor(private newPropertyName: string) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const request = context.switchToHttp().getRequest<UserExtendedRequest>();

		request.body[this.newPropertyName] = request.user.id;
		// delete request.user; //TOOD: 꼭 지워야 하나? 지우지 않았을 때의 단점과 지웠을 때의 장점 찾아보기. -> 지우면 @CurrentUser로 사용하지 못함
		return next.handle();
	}
}
