import { ActiveBrokersPipe } from './active-brokers.pipe';

describe('ActiveBrokersPipe', () => {
  it('create an instance', () => {
    const pipe = new ActiveBrokersPipe();
    expect(pipe).toBeTruthy();
  });
});
