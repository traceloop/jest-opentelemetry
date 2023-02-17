import axios from 'axios';
import express from 'express';

const ordersService = express();
const emailsService = express();

ordersService.post('/orders/create', (req, res) => {
  res.send('Order created!');
  axios.post('http://localhost:3001/emails/send');
});

emailsService.post('/emails/send', (req, res) => {
  res.send('Email sent!');
});

ordersService.listen(3000, () => {
  console.log(`Orders service listening at http://localhost:3000`);
});

emailsService.listen(3001, () => {
  console.log(`Emails service listening at http://localhost:3001`);
});
