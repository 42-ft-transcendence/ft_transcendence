import { Controller } from '@nestjs/common';
import { AdministratorService } from './administrator.service';

@Controller('administrator')
export class AdministratorController {
	constructor(private administratorService: AdministratorService) { }
}
