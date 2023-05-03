import grpc from '@grpc/grpc-js';
import { usersService } from './user-service';
import { gigsService } from './gig-service';
import { ordersService } from './orders-service';
import { emailsService } from './email-service';
import { biGrpcService } from './bi-grpc-service';
import { gatewayService } from './gateway';
import {
  USERS_SERVICE_PORT,
  GIGS_SERVICE_PORT,
  ORDERS_SERVICE_PORT,
  EMAILS_SERVICE_PORT,
  GRPC_SERVICE_PORT,
} from './constants';

// --- Initialize Services ---
const PORT = process.env.PORT || 3000;
gatewayService.listen(PORT, () => {
  console.log(`Gateway service listening at http://localhost:${PORT}`);
});

usersService.listen(USERS_SERVICE_PORT, () => {
  console.log(
    `Users service listening at http://localhost:${USERS_SERVICE_PORT}`,
  );
});

gigsService.listen(GIGS_SERVICE_PORT, () => {
  console.log(
    `Gigs service listening at http://localhost:${GIGS_SERVICE_PORT}`,
  );
});

ordersService.listen(ORDERS_SERVICE_PORT, () => {
  console.log(
    `Orders service listening at http://localhost:${ORDERS_SERVICE_PORT}`,
  );
});

emailsService.listen(EMAILS_SERVICE_PORT, () => {
  console.log(
    `Emails service listening at http://localhost:${EMAILS_SERVICE_PORT}`,
  );
});

biGrpcService.bindAsync(
  `0.0.0.0:${GRPC_SERVICE_PORT}`,
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log(`gRPC service listening on port ${GRPC_SERVICE_PORT}`);
    biGrpcService.start();
  },
);
