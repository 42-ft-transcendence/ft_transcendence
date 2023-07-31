import { Controller } from '@nestjs/common';
import { BanService } from './ban.service';

@Controller('ban')
export class BanController {
  constructor(private banService: BanService) {}
}
