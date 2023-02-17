import axios from 'axios';
import { traces } from './trace';

describe('trace', () => {
  it('should see orders-service calling emails-service', async () => {
    const sequence = await traces(async () =>
      axios.post('http://localhost:3000/orders/create'),
    );
    expect(sequence.service('orders')).toSendHttpRequest();
  });
});
