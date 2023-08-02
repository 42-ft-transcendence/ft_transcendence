import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { FollowsModule } from './follows/follows.module';

@Module({
  imports: [UsersModule, FollowsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
