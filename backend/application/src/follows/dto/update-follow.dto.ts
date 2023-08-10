import { PartialType } from '@nestjs/swagger';
import { CreateFollowDto } from '.';

export class UpdateFollowDto extends PartialType(CreateFollowDto) {}
