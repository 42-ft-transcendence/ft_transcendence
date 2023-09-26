import { ArgumentsHost, Catch, WsExceptionFilter } from '@nestjs/common';
import { SocketException } from 'src/common';

@Catch(SocketException)
export class SocketExceptionFilter implements WsExceptionFilter {
	catch(exception: SocketException, host: ArgumentsHost) {
		const client = host.switchToWs().getClient();
		client.emit('socket Exception', { message: exception.message });
	}
}
