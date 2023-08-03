import { Module } from '@nestjs/common';
import { BansService } from './bans.service';
import { BansController } from './bans.controller';
import { PrismaModule } from 'src/common';

@Module({
  controllers: [BansController],
  providers: [BansService],
  imports: [PrismaModule],
})
export class BansModule {}
