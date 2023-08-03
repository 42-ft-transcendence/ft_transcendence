import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { isPositive } from 'class-validator';

@Injectable()
export class ParsePositiveIntPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const parsed = parseInt(value);

    if (!isPositive(parsed)) {
      throw new BadRequestException('id should be positive number');
    }
    return parsed;
  }
}
