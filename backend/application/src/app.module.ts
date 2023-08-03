import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { FollowsModule } from './follows/follows.module';
import { ChannelsModule } from './channels/channels.module';
import { ChannelPasswordsModule } from './channel-passwords/channel-passwords.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [
    UsersModule,
    FollowsModule,
    ChannelsModule,
    ChannelPasswordsModule,
    MessagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
