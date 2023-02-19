import axios from 'axios';
import { traces } from './trace';

jest.setTimeout(30000);

describe('trace', () => {
  it('should see orders-service calling emails-service', async () => {
    const sequence = await traces(async () => {
      await axios.post('http://localhost:3000/orders/create');
    });

    expect(sequence.service('orders-service')).toSendHttpRequest();
  });
});
