import { jest, describe, it } from '@jest/globals';
import { expectTrace } from '../..';
import { TraceLoop } from '../trace-loop';

jest.setTimeout(30000);

describe('resource http request matchers', () => {
  describe('when orders-service makes an http call to emails-service', () => {
    let traceloop: TraceLoop;
    beforeAll(async () => {
      traceloop = new TraceLoop();

      await traceloop.axiosInstance.post('http://localhost:3000/orders/create');
      await traceloop.fetchTraces();
    });

    it('should contain outbound http call from orders-service with all parameters', async () => {
      expectTrace(traceloop.serviceByName('orders-service'))
        .toSendHttpRequest()
        .withMethod('POST')
        .withUrl('/emails/send', { compareType: 'contains' })
        .withRequestHeader('content-type', 'application/json')
        .withRequestBody({
          email: 'test',
          nestedObject: { test: 'test' },
        })
        .withRequestBody(
          { nestedObject: { test: 'test' } },
          { compareType: 'contains' },
        )
        .withStatusCode(200);
    });

    it('should contain inbound http call to emails-service', async () => {
      expectTrace(traceloop.serviceByName('emails-service'))
        .toReceiveHttpRequest()
        .withMethod('POST')
        .withUrl('/emails/send', { compareType: 'contains' })
        .withStatusCode(200);
    });
  });
});
