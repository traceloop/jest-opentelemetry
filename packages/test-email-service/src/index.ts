import axios from 'axios';
import express from 'express';

const emailsService = express();

emailsService.post('/emails/send', (req, res) => {
  res.send('Email sent!');
});

emailsService.listen(3001, () => {
  console.log(`Emails service listening at http://localhost:3001`);
});
