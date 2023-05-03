import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import { GRPC_SERVICE_PORT } from './constants';

const PROTO_PATH = __dirname + '/bi.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const bi_proto = grpc.loadPackageDefinition(packageDefinition).bi;

export const biGrpcService = new grpc.Server();

function reportBi(call: any, callback: any) {
  callback(null, { message: 'Received BI event from ' + call.request.name });
}
biGrpcService.addService((bi_proto as any).Bi.service, {
  reportBi: reportBi,
});

const client = new (bi_proto as any).Bi(
  `localhost:${GRPC_SERVICE_PORT}`,
  grpc.credentials.createInsecure(),
);

// should be called from other services (makes an rpc call to the bi grpc service)
export const sendBiEvent = (name: string, id: string) => {
  client.reportBi({ name: name, id: id }, function (_: any, response: any) {
  });
};
