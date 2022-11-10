import { FriendlyDeviceNamePipe } from './friendly-device-name.pipe';

describe('FriendlyDeviceNamePipe', () => {
  it('create an instance', () => {
    const pipe = new FriendlyDeviceNamePipe();
    expect(pipe).toBeTruthy();
  });
});
