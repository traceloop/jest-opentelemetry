import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { initializeDbIfNeeded, postgresDb } from './postgres';
import { sendEmail } from './email-service';
import { sendBiEvent } from './bi-grpc-service';

export const ordersService = express();
ordersService.use(express.json());

// required body params:
// - gig_title
// - buyer_name
ordersService.post('/orders/create', async (req, res) => {
  await initializeDbIfNeeded();

  const orderId = uuidv4();
  console.log(
    `Creating order ${orderId} with gig title ${req.body.gig_title} for buyer ${req.body.buyer_name}`,
  );

  try {
    // check buyer exists
    const userRes = await postgresDb.query(
      `SELECT * FROM users WHERE name = '${req.body.buyer_name}'`,
    );
    if (!userRes?.length) {
      throw new Error(`User ${req.body.buyer_name} not found`);
    }
    const buyerId = userRes[0].id;

    // check gig exists
    const existingGigs = await postgresDb.query(
      `SELECT * FROM gigs WHERE title = '${req.body.gig_title}'`,
    );
    if (!existingGigs?.length) {
      throw new Error(
        `A gig with the title "${req.body.gig_title}" was not found.`,
      );
    }
    const gigId = existingGigs[0].id;
    const sellerId = existingGigs[0].user_id;

    // create order
    postgresDb.query(
      `INSERT INTO orders (id, gig_id, seller_id, buyer_id) VALUES ('${orderId}', '${gigId}', '${sellerId}', '${buyerId}}')`,
    );

    sendEmail({
      message: 'Order created!',
      gigTitle: req.body.gig_title,
      buyerId: buyerId,
      sellerId: sellerId,
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
