import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * 요청 헤더 중 Authorization 헤더의 값에 설정된 JWT 값을 해석해 유효하지 않은 토큰일 시 예외를 반환한다.
 * 만약 그 값이 유효한 토큰이라면, 데이터베이스 내에서 대응하는 사용자를 찾아 요청 객체의 user 속성에 할당한다.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
