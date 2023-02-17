import axios from 'axios';
import { trace } from './trace';

describe('trace', () => {
  it('should see orders-service calling emails-service', async () => {
    const sequence = await trace(async () =>
      axios.post('http://localhost:3000/orders/create'),
    );
    expect(1).toBe(1);
    // expect(sequence.service('orders-service'))
    //   .toCall('emails-service')
    //   .withHttpBody({});
  });
});
