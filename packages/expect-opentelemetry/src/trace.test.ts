import axios from 'axios';
import { traces } from './trace';

describe('trace', () => {
  it('should see orders-service calling emails-service', async () => {
    const sequence = await traces(async () => {
      await axios.post('http://localhost:3000/orders/create');
      console.log('post request sent');
    });

    expect(sequence.service('orders')).toSendHttpRequest();
  });
});
