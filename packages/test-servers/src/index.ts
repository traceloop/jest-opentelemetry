import grpc from '@grpc/grpc-js';
import { usersService } from './user-service';
import { gigsService } from './gig-service';
import { ordersService } from './orders-service';
import { emailsService } from './email-service';
import { biGrpcService } from './bi-grpc-service';
import { gatewayService } from './gateway';
import { initializeSyntheticTraffic } from './synthetic-traffic';
import {
  USERS_SERVICE_PORT,
  GIGS_SERVICE_PORT,
  ORDERS_SERVICE_PORT,
  EMAILS_SERVICE_PORT,
  GRPC_SERVICE_PORT,
  GATEWAY_SERVICE_PORT,
} from './constants';

// --- Initialize Services ---
process.env.GATEWAY_SERVICE &&
  gatewayService.listen(GATEWAY_SERVICE_PORT, () => {
    console.log(
      `Gateway service listening at http://localhost:${GATEWAY_SERVICE_PORT}`,
    );
  });

process.env.USERS_SERVICE &&
  usersService.listen(USERS_SERVICE_PORT, () => {
    console.log(
      `Users service listening at http://localhost:${USERS_SERVICE_PORT}`,
    );
  });

process.env.GIGS_SERVICE &&
  gigsService.listen(GIGS_SERVICE_PORT, () => {
    console.log(
      `Gigs service listening at http://localhost:${GIGS_SERVICE_PORT}`,
    );
  });

process.env.ORDERS_SERVICE &&
  ordersService.listen(ORDERS_SERVICE_PORT, () => {
    console.log(
      `Orders service listening at http://localhost:${ORDERS_SERVICE_PORT}`,
    );
  });

process.env.EMAILS_SERVICE &&
  emailsService.listen(EMAILS_SERVICE_PORT, () => {
    console.log(
      `Emails service listening at http://localhost:${EMAILS_SERVICE_PORT}`,
    );
  });

process.env.GRPC_SERVICE &&
  biGrpcService.bindAsync(
    `0.0.0.0:${GRPC_SERVICE_PORT}`,
    grpc.ServerCredentials.createInsecure(),
    () => {
      console.log(`gRPC service listening on port ${GRPC_SERVICE_PORT}`);
      biGrpcService.start();
    },
  );

process.env.NOT_INSTRUMENTED && initializeSyntheticTraffic();
