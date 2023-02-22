import axios from 'axios';
import express from 'express';
import { DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

const ordersDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT) : 5432,
  username: process.env.POSTGRES_USERNAME || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DATABASE || 'postgres',
});

const postgresSchema = process.env.POSTGRES_SCHEMA || 'public';
let ordersDataSourceInitialized = false;

const initializeOrdersDatasource = async () =>
  ordersDataSource
    .initialize()
    .then(async () => {
      console.log('Orders data Source has been initialized!');
      await ordersDataSource.query(
        `CREATE TABLE IF NOT EXISTS ${postgresSchema}.orders (id varchar(50), price_in_cents int)`,
      );
      ordersDataSourceInitialized = true;
      console.log('Orders table has been created!');
    })
    .catch((err) => {
      console.error('Error during orders data source initialization', err);
    });

if (process.env.ORDERS_SERVICE) {
  initializeOrdersDatasource();
}

const ordersService = express();
const emailsService = express();

ordersService.post('/orders/create', async (req, res) => {
  if (!ordersDataSourceInitialized) {
    await initializeOrdersDatasource();
  }

  const orderId = uuidv4();
  console.log('Creating order...');

  try {
    ordersDataSource.query(
      `INSERT INTO orders (id, price_in_cents) VALUES ('${orderId}', 1000)`,
    );
  } catch (err) {
    console.error('Error creating order', err);
    console.log(
      'Omitting order creation, please make sure the database is running',
    );
  }

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
