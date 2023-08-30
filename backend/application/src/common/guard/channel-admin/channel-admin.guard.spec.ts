import { ChannelAdminGuard } from './channel-admin.guard';

describe('ChannelAdminGuard', () => {
  it('should be defined', () => {
    expect(new ChannelAdminGuard()).toBeDefined();
  });
});
