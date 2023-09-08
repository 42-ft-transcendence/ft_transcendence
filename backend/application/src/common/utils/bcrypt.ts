import * as bcrypt from 'bcrypt';

export async function hash(rawPassword: string) {
	return await bcrypt.hash(rawPassword, await bcrypt.genSalt());
}

export async function compare(inputPassword: string, hashedPassword: string) {
	return await bcrypt.compare(inputPassword, hashedPassword);
}
