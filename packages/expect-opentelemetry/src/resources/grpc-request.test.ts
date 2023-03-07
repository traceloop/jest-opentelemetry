import { jest, describe, it } from '@jest/globals';
import { expectTrace } from '../..';
import { TraceLoop } from '../trace-loop';
import { GrpcRequest } from '../resources/grpc-request';

jest.setTimeout(30000);

describe('resource grpc request matchers', () => {
  describe('when orders-service makes a gRPC call to grpc-service', () => {
    let traceloop: TraceLoop;
    beforeAll(async () => {
      traceloop = new TraceLoop();

      await traceloop.axiosInstance.post('http://localhost:3000/orders/create');
      await traceloop.fetchTraces();
    });

    it('should contain outbound grpc call from orders-service with all parameters', async () => {
      expectTrace(traceloop.serviceByName('orders-service'))
        .toSendGrpcRequest()
        .withRpcMethod('SayHello')
        .withRpcService('Greeter', { compareType: 'contains' })
        .withRpcGrpcStatusCode(GrpcRequest.GRPC_STATUS_CODE.OK);
    });

    it('should contain inbound gRPC call to grpc-service', async () => {
      expectTrace(traceloop.serviceByName('grpc-service'))
        .toReceiveGrpcRequest()
        .withRpcMethod('SayHello')
        .withRpcService('Greeter', { compareType: 'contains' })
        .withRpcGrpcStatusCode(GrpcRequest.GRPC_STATUS_CODE.OK);
    });
  });
});
