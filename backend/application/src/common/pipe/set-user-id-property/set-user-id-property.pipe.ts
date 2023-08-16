import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
/**
 * AddUserIdToBodyInterceptor가 설정한 request.body.userId의 값을 가져와 필요한 이름을 가진 속성으로 새로 설정한다.
 * 
 * [사용 X] class-validator ValidationPipe가 전역 파이프이므로 무조건 먼저 실행되기 때문에 이 파이프의 기능이 적용되기 전에 예외가 발생한다.
 * 
 * 파이프 적용 순서: 전역 -> 컨트롤러 레벨 -> 라우트 레벨 
 */
@Injectable()
export class SetUserIdPropertyPipe implements PipeTransform {
  constructor(private newPropertyName: string) { }

  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'body') {
      value[this.newPropertyName] = value.userId;
      delete value.userId;
    }
    return value;
  }
}
