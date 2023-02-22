import { jest, describe, it } from '@jest/globals';
import { expectTrace } from '../..';
import { TraceLoop } from '../../trace-loop';
import { setTimeout } from 'timers/promises';

jest.setTimeout(30000);

describe('send-http-request', () => {
  it('should see orders-service calling emails-service', async () => {
    const traceloop = new TraceLoop();
    const axios = traceloop.axiosInstance; // contains trace-loop-id header set to t.traceLoopId (uuid)

    await setTimeout(1000); // to give the orders service (under test) enough time to come up. On running environments this is not needed.
    await axios.post('http://localhost:3000/orders/create'); // or use t.traceLoopId to set the header manually
    await traceloop.fetchTraces();

    expectTrace(traceloop.service('orders-service'))
      .toSendHttpRequest()
      .ofMethod('POST');
  });
});
