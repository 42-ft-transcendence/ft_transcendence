import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { FourtyTwoUser, PrismaModule } from 'src/common';
import { AuthModule } from 'src/auth/auth.module';

@Module({
	controllers: [UsersController],
	providers: [UsersService],
	imports: [
		PrismaModule,
		AuthModule,
		MulterModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				storage: diskStorage({
					destination(req, file, callback) {
						const dest = configService.get<string>('MULTER_DEST');
						if (!dest) callback(null, './avatar-upload');
						else callback(null, dest);
					},
					filename(req, file, callback) {
						// Multer는 FileInterceptor로 적용이 되고, 인터셉터는 Guard보다 나중에 적용되므로 FileInterceptor가 적용되는 시점엔 req.user에 id 속성은 반드시 존재한다.
						// id 속성이 존재하지 않는다면, 이는 JWT가 유효하지 않다는 말이므로 애초에 JwtAuthGuard에서 예외를 던져 이 코드가 실행되지 않는다.
						callback(
							null,
							`/${req.user['nickname']}_avatar.
							${file.mimetype.split('image/').at(1)}`,
						); //TODO: 파일 확장자 추가?
					},
				}),
			}),
			inject: [ConfigService],
		}),
	],
})
export class UsersModule {}
