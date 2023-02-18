import axios from 'axios';
import express from 'express';

const ordersService = express();
const emailsService = express();

ordersService.post('/orders/create', async (req, res) => {
  console.log('Order created! Sending email...');
  const EMAILS_SERVICE_URL =
    process.env.EMAILS_SERVICE_URL || 'http://localhost:3001';
  await axios.post(`${EMAILS_SERVICE_URL}/emails/send`);

  res.send('Order created!');
});

emailsService.post('/emails/send', (req, res) => {
  console.log('Email sent!');
  res.send('Email sent!');
});

const PORT = process.env.PORT || 3000;

if (process.env.ORDERS_SERVICE) {
  ordersService.listen(PORT, () => {
    console.log(`Orders service listening at http://localhost:${PORT}`);
  });
}

if (process.env.EMAILS_SERVICE) {
  emailsService.listen(PORT, () => {
    console.log(`Emails service listening at http://localhost:${PORT}`);
  });
}
