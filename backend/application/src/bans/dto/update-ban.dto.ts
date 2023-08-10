import { PartialType } from '@nestjs/swagger';
import { CreateBanDto } from '.';

export class UpdateBanDto extends PartialType(CreateBanDto) {}
