import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import {
  USERS_SERVICE_PORT,
  GIGS_SERVICE_PORT,
  ORDERS_SERVICE_PORT,
} from './constants';

export const gatewayService = express();

if (process.env.GATEWAY_SERVICE) {
  gatewayService.use(
    '/users',
    createProxyMiddleware({
      target: `http://localhost:${USERS_SERVICE_PORT}`,
      changeOrigin: true,
    }),
  );

  gatewayService.use(
    '/gigs',
    createProxyMiddleware({
      target: `http://localhost:${GIGS_SERVICE_PORT}`,
      changeOrigin: true,
    }),
  );

  gatewayService.use(
    '/orders',
    createProxyMiddleware({
      target: `http://localhost:${ORDERS_SERVICE_PORT}`,
      changeOrigin: true,
    }),
  );
}
