import axios from 'axios';
import express from 'express';

const ordersService = express();

ordersService.post('/orders/create', (req, res) => {
  res.send('Order created!');
  axios.post('http://localhost:3001/emails/send');
});

ordersService.listen(3000, () => {
  console.log(`Orders service listening at http://localhost:3000`);
});

