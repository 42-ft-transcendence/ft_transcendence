import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ChatModule } from './chat/chat.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { Friendship } from './users/entities/friendship.entity';
import { Match } from './users/entities/match.entity';
import { Administrator } from './chat/entities/administrator.entity';
import { Banned } from './chat/entities/banned.entity';
import { Blocked } from './chat/entities/blocked.entity';
import { Channel } from './chat/entities/channel.entity';
import { ChannelPassword } from './chat/entities/channel-password.entity';
import { Message } from './chat/entities/message.entity';
import { Participant } from './chat/entities/participant.entity';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: "postgres",
    entities: [
      User, Friendship, Match, Blocked, Channel, Administrator, Banned, Participant, Message, ChannelPassword
    ],
    logging: true,
    maxQueryExecutionTime: 1000,
    // poolSize: ? // TODO: test performance on its value
    synchronize: true, // database schema is auto-created on every application launch
    // cache
    host: "db", // TODO: use .env
    port: 5432, // TODO: use .env
    username: "test", //TODO: use .env
    password: "test", //TODO: use .env
    applicationName: "ft_transcendence",
  }), UsersModule, ChatModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
