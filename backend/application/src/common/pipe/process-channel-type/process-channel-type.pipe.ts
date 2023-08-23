import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { ChannelType } from '@prisma/client';
import { QueryChannelType } from 'src/common/enum';

@Injectable()
export class ProcessChannelTypePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'query') {
      const type = value['type'];
      delete value['type'];
      value['type'] =
        type === QueryChannelType.GROUP
          ? [ChannelType.PUBLIC, ChannelType.PROTECTED]
          : [ChannelType.ONETOONE];
    }
    return value;
  }
}
