import { Request } from 'express';
import { User } from '@prisma/client';

export interface UserExtendedRequest extends Request {
	user: User;
}
