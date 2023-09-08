import { IsNotEmpty, IsString } from 'class-validator';
import { QueryChannelDto } from '.';

export class QueryNameChannelDto extends QueryChannelDto {
  @IsString()
  @IsNotEmpty()
  partialName: string;
}
