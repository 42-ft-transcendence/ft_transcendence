import { PartialType } from '@nestjs/swagger';
import { CreateMatchDto } from '.';

export class UpdateMatchDto extends PartialType(CreateMatchDto) {}
