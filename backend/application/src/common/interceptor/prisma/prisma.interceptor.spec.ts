import { PrismaInterceptor } from './prisma.interceptor';

describe('PrismaInterceptor', () => {
  it('should be defined', () => {
    expect(new PrismaInterceptor()).toBeDefined();
  });
});
