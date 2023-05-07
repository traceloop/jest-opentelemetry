import express from 'express';
import axios from 'axios';
import { EMAILS_SERVICE_PORT } from './constants';

export const emailsService = express();

emailsService.post('/emails/send', (req, res) => {
  res.send('Email sent!');
});

// should be called from other services (makes an http call to the emails service)
export const sendEmail = async (body: any) => {
  try {
    return await axios.post(
      `http://localhost:${EMAILS_SERVICE_PORT}/emails/send`,
      body,
    );
  } catch (err) {
    console.error('Error sending email', err);
  }
};
