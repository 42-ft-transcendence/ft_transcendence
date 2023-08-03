import { PartialType } from '@nestjs/swagger';
import { CreateAdministratorDto } from '.';

export class UpdateAdministratorDto extends PartialType(
  CreateAdministratorDto,
) {}
