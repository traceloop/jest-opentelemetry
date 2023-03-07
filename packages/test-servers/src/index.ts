import axios from 'axios';
import express from 'express';
import { DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';

// --- Protos ---
const PROTO_PATH = __dirname + '/helloworld.proto';

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const hello_proto = grpc.loadPackageDefinition(packageDefinition).helloworld;

// --- Postgres ---
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

// --- Orders Service ---
const ordersService = express();

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

  // make http call
  console.log('Order created! Sending email...');
  const EMAILS_SERVICE_URL =
    process.env.EMAILS_SERVICE_URL || 'http://localhost:3001';
  await axios.post(`${EMAILS_SERVICE_URL}/emails/send`, {
    email: 'test',
    nestedObject: { test: 'test' },
  });

  // make grpc call
  console.log('Making gRPC call');
  const GRPC_SERVICE_URL = process.env.GRPC_SERVICE_URL || 'localhost:50051';
  const client = new (hello_proto as any).Greeter(
    GRPC_SERVICE_URL,
    grpc.credentials.createInsecure(),
  );

  client.sayHello({ name: 'name' }, function (_: any, response: any) {
    console.log('Greeting:', response.message);
  });

  res.send('Order created!');
});

// --- Emails Service ---
const emailsService = express();

emailsService.post('/emails/send', (req, res) => {
  console.log('Email sent!');
  res.send('Email sent!');
});

// --- gRPC Service ---
const grpcServer = new grpc.Server();

function sayHello(call: any, callback: any) {
  callback(null, { message: 'Hello ' + call.request.name });
}
grpcServer.addService((hello_proto as any).Greeter.service, {
  sayHello: sayHello,
});

// --- Initialize Service ---
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

if (process.env.GRPC_SERVICE) {
  grpcServer.bindAsync(
    `0.0.0.0:${PORT}`,
    grpc.ServerCredentials.createInsecure(),
    () => {
      console.log(`gRPC service listening on port ${PORT}`);
      grpcServer.start();
    },
  );
}
