import axios from 'axios';
import { Trace } from './trace';

jest.setTimeout(30000);

describe('trace', () => {
  it('should see orders-service calling emails-service', async () => {
    const trace = await Trace.trigger(async () => {
      await axios.post('http://localhost:3000/orders/create');
    });

    expect(trace.service('orders-service'))
      .toSendHttpRequest()
      .ofMethod('POST');
  });
});
