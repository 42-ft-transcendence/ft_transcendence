import * as bcrypt from 'bcrypt';

export async function hash(rawPassword: string) {
  return await bcrypt.hash(rawPassword, await bcrypt.genSalt());
}
