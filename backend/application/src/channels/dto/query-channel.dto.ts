import { IsEnum, IsNotEmpty } from 'class-validator';
import { ChannelType } from '@prisma/client';
import { QueryChannelType } from 'src/common';

export class QueryChannelDto {
  @IsEnum(QueryChannelType)
  @IsNotEmpty()
  type: ChannelType[];
}
