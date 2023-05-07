import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { initializeDbIfNeeded, postgresDb } from './postgres';
import { sendEmail } from './email-service';
import { sendBiEvent } from './bi-grpc-service';

export const ordersService = express();
ordersService.use(express.json());

ordersService.get('/orders/:orderId', async (req, res) => {
  await initializeDbIfNeeded();

  const orderId = req.params.orderId;
  console.log(`Getting order ${orderId}`);

  try {
    const orderRes = await postgresDb.query(
      `SELECT * FROM orders WHERE id = '${orderId}'`,
    );
    if (!orderRes?.length) {
      throw new Error(`Order ${orderId} not found`);
    }

    res.status(200);
    res.send(orderRes[0]);
  } catch (err) {
    console.error('Error getting order', err);
    res.status(500);
    res.send({ error: 'Error getting order', message: err.message });
  }
});

ordersService.delete('/orders/:orderId', async (req, res) => {
  await initializeDbIfNeeded();

  const orderId = req.params.orderId;
  console.log(`Deleting order ${orderId}`);

  try {
    const orderRes = await postgresDb.query(
      `SELECT * FROM orders WHERE id = '${orderId}'`,
    );
    if (!orderRes?.length) {
      throw new Error(`Order ${orderId} not found`);
    }

    await postgresDb.query(`DELETE FROM orders WHERE id = '${orderId}'`);

    res.status(200);
    res.send({ message: `Order ${orderId} deleted` });
  } catch (err) {
    console.error('Error deleting order', err);
    res.status(500);
    res.send({ error: 'Error deleting order', message: err.message });
  }
});

// required body params:
// - gig_id
// - buyer_id
ordersService.post('/orders/create', async (req, res) => {
  await initializeDbIfNeeded();

  const orderId = uuidv4();
  console.log(
    `Creating order ${orderId} with gig id ${req.body.gig_id} for buyer ${req.body.buyer_id}`,
  );

  try {
    // check buyer exists
    const userRes = await postgresDb.query(
      `SELECT * FROM users WHERE id = '${req.body.buyer_id}'`,
    );
    if (!userRes?.length) {
      throw new Error(`User ${req.body.buyer_id} not found`);
    }
    const buyerId = userRes[0].id;

    // check gig exists
    const existingGigs = await postgresDb.query(
      `SELECT * FROM gigs WHERE id = '${req.body.gig_id}'`,
    );
    if (!existingGigs?.length) {
      throw new Error(`A gig with the id "${req.body.gig_id}" was not found.`);
    }
    const gigId = existingGigs[0].id;
    const sellerId = existingGigs[0].user_id;

    // create order
    postgresDb.query(
      `INSERT INTO orders (id, gig_id, seller_id, buyer_id) VALUES ('${orderId}', '${gigId}', '${sellerId}', '${buyerId}}')`,
    );

    sendEmail({
      message: 'Order created!',
      gigId,
      buyerId,
      sellerId,
      id: orderId,
    });

    sendBiEvent('order_created', orderId);

    res.status(201);
    res.send({ orderId });
  } catch (err) {
    console.error('Error creating order', err);

    res.status(500);
    res.send({ error: 'Error creating order', message: err.message });
  }
});
