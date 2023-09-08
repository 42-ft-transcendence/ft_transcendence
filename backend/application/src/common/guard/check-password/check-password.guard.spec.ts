import { CheckPasswordGuard } from './check-password.guard';

describe('CheckPasswordGuard', () => {
  it('should be defined', () => {
    expect(new CheckPasswordGuard()).toBeDefined();
  });
});
