import { Module } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { PrismaModule } from 'src/common';

@Module({
  controllers: [MatchesController],
  providers: [MatchesService],
  imports: [PrismaModule],
})
export class MatchesModule {}
