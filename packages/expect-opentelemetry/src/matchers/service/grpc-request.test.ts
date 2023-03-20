import { jest, describe, it, beforeAll } from '@jest/globals';
import { expectTrace } from '../..';
import { TraceLoop } from '../../trace-loop';

jest.setTimeout(30000);

describe('grpc request matchers', () => {
  describe('when orders-service makes a gRPC call to the grpc server', () => {
    let traceloop: TraceLoop;
    beforeAll(async () => {
      traceloop = new TraceLoop();

      await traceloop.axiosInstance.post('http://localhost:3000/orders/create');
      await traceloop.fetchTraces();
    });

    it('should contain outbound gRPC call from orders-service', async () => {
      expectTrace(
        traceloop.serviceByName('orders-service'),
      ).toSendGrpcRequest();
    });

    it('should contain inbound gRPC call to grpc service', async () => {
      expectTrace(
        traceloop.serviceByName('grpc-service'),
      ).toReceiveGrpcRequest();
    });
  });
});
