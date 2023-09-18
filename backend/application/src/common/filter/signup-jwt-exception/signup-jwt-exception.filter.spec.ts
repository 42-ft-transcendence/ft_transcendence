import { SignupJwtExceptionFilter } from './signup-jwt-exception.filter';

describe('SignupExceptionFilter', () => {
  it('should be defined', () => {
    expect(new SignupJwtExceptionFilter()).toBeDefined();
  });
});
