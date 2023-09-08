import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { hash } from 'src/common';

@Injectable()
export class HashPasswordPipe implements PipeTransform {
	async transform(value: any, metadata: ArgumentMetadata) {
		if (metadata.type === 'body' && value.password)
			value.password = await hash(value.password);
		return value;
	}
}
