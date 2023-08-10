// faker.helpers.uniqueArray() 는 1000개 정도를 넘어서는 unique string을 생성할 때 너무 오래걸림.

function generateRandomString(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export function generateUniqueRandomStrings(num: number, length: number): string[] {
  const result: Set<string> = new Set();
  while (result.size < num) {
    result.add(generateRandomString(length));
  }
  return Array.from(result);
}