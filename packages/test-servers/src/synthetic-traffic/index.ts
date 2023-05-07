import { wait } from './utils';
import {
  createUser,
  createGig,
  createOrder,
  deleteGig,
  deleteOrder,
  deleteUser,
} from './crud-operations';

const INTERVAL_MINUTES = 5;
const OPERATION_INTERVAL_MS = 5000;

let sellerId, buyerId, gigId, orderId: string;

export const initializeSyntheticTraffic = async () => {
  await wait(OPERATION_INTERVAL_MS);

  console.log('Synthetic traffic started');
  syntheticTrafficFlow();
  setInterval(syntheticTrafficFlow, INTERVAL_MINUTES * 60 * 1000);
};

const syntheticTrafficFlow = async () => {
  try {
    const seller = await createUser();
    sellerId = seller.userId;

    await wait(OPERATION_INTERVAL_MS);

    const buyer = await createUser();
    buyerId = buyer.userId;

    await wait(OPERATION_INTERVAL_MS);

    const gig = await createGig(sellerId);
    gigId = gig.gigId;

    await wait(OPERATION_INTERVAL_MS);

    const order = await createOrder(gigId, buyerId);
    orderId = order.orderId;

    await wait(OPERATION_INTERVAL_MS);

    await cleanup();
  } catch (err) {
    console.error('Synthetic traffic error', err);

    await cleanup();
  }
};

const cleanup = async () =>
  await Promise.allSettled([
    deleteOrder(orderId),
    deleteGig(gigId),
    deleteUser(buyerId),
    deleteUser(sellerId),
  ]);
