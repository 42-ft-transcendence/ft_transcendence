import { ChannelType } from '@prisma/client';
import {
	registerDecorator,
	ValidationOptions,
	ValidationArguments,
	isNotEmpty,
	buildMessage,
} from 'class-validator';
/**
 * ChannelType이 PROTECTED일 때 password 프로퍼티에 비밀번호 값이 들어왔는지 검증한다.
 * ChannelType이 PROTECTED가 아니라면 password 프로퍼티가 undefined여야 true를 반환한다.
 */
export function HasPassword(validationOptions?: ValidationOptions) {
	return function (object: object, propertyName: string) {
		registerDecorator({
			name: 'hasPassword',
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			validator: {
				// defaultMessage: buildMessage((eachPrefix, args) => {
				// 	return args.value === ChannelType.PROTECTED
				// 		? `$value 채널에는 비밀번호가 필요합니다.`
				// 		: `$value 채널에는 비밀번호가 없어야 합니다.`;
				// }),
				validate(value: any, args: ValidationArguments) {
					const passwordProperty = (args.object as any)['password'];
					return (
						(value === ChannelType.PROTECTED && isNotEmpty(passwordProperty)) ||
						(value !== ChannelType.PROTECTED && passwordProperty === undefined)
					);
				},
			},
		});
	};
}
