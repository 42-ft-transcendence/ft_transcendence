import { Module } from '@nestjs/common';
import { BannedController } from './banned.controller';
import { BannedService } from './banned.service';

@Module({
  controllers: [BannedController],
  providers: [BannedService]
})
export class BannedModule {}
