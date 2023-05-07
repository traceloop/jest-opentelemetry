import axios from 'axios';
import { GATEWAY_SERVICE_PORT } from '../constants';
import { randNumber } from './utils';
import { postgresDb, initializeDbIfNeeded } from '../postgres';

export const createUser = async () => {
  const userName = `synthetic_user-${randNumber(1, 1000)}`;
  const user = await axios.post<{ userId: string }>(
    `http://localhost:${GATEWAY_SERVICE_PORT}/users/create`,
    {
      name: userName,
    },
  );

  return user.data;
};

export const createGig = async (sellerId: string) => {
  const gigTitle = `synthetic_gig-${randNumber(1, 1000)}`;
  const gig = await axios.post<{ gigId: string }>(
    `http://localhost:${GATEWAY_SERVICE_PORT}/gigs/create`,
    {
      title: gigTitle,
      user_id: sellerId,
    },
  );

  return gig.data;
};

export const createOrder = async (gigId: string, buyerId: string) => {
  const order = await axios.post<{ orderId: string }>(
    `http://localhost:${GATEWAY_SERVICE_PORT}/orders/create`,
    {
      gig_id: gigId,
      buyer_id: buyerId,
    },
  );

  return order.data;
};

export const deleteOrder = async (orderId: string) => {
  console.log(`Deleting order ${orderId}`);
  await initializeDbIfNeeded();
  await postgresDb.query(`DELETE FROM orders WHERE id = '${orderId}'`);
};

export const deleteUser = async (userId: string) => {
  await initializeDbIfNeeded();
  await postgresDb.query(`DELETE FROM users WHERE id = '${userId}'`);
};

export const deleteGig = async (gigId: string) => {
  await initializeDbIfNeeded();
  await postgresDb.query(`DELETE FROM gigs WHERE id = '${gigId}'`);
};
