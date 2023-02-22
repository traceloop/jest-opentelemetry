import { jest, describe, it } from '@jest/globals';
import { expectTrace } from '../..';
import { TraceLoop } from '../../trace-loop';

jest.setTimeout(30000);

describe('http request matchers', () => {
  describe('when orders-service makes an http call to emails-service', () => {
    let traceloop: TraceLoop;
    beforeAll(async () => {
      traceloop = new TraceLoop();

      await traceloop.axiosInstance.post('http://localhost:3000/orders/create');
      await traceloop.fetchTraces();
    });

    it('should contain outbound http call from orders-service', async () => {
      expectTrace(
        traceloop.serviceByName('orders-service'),
      ).toSendHttpRequest();
    });

    it('should contain inbound http call to emails-service', async () => {
      expectTrace(
        traceloop.serviceByName('emails-service'),
      ).toReceiveHttpRequest();
    });
  });
});
