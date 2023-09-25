import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { PrismaClientExceptionFilter } from './common';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			stopAtFirstError: true,
			dismissDefaultMessages: true,
		}),
	);
	const { httpAdapter } = app.get(HttpAdapterHost);
	app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
	app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

	const document = SwaggerModule.createDocument(
		app,
		new DocumentBuilder()
			.setTitle('FT_TRANSCENDENCE')
			.setDescription('THE FT_TRANSCENDENCE API')
			.setVersion('0.1')
			.build(),
	);
	SwaggerModule.setup('api', app, document);

	await app.listen(3000);
}
bootstrap();
