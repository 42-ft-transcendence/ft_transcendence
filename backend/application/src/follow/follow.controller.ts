import { Controller } from '@nestjs/common';
import { FollowService } from './follow.service';

@Controller('friendship')
export class FollowController {
  constructor(private followService: FollowService) {}
}
