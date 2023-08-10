import { PartialType } from '@nestjs/swagger';
import { CreateBlockDto } from '.';

export class UpdateBlockDto extends PartialType(CreateBlockDto) {}
