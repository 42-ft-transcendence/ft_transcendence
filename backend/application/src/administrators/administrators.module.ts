import { Module } from '@nestjs/common';
import { AdministratorsService } from './administrators.service';
import { AdministratorsController } from './administrators.controller';
import { PrismaModule } from 'src/common';

@Module({
  controllers: [AdministratorsController],
  providers: [AdministratorsService],
  imports: [PrismaModule],
})
export class AdministratorsModule {}
