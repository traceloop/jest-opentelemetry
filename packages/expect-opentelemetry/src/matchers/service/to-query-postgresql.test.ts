import { jest, describe, it, beforeAll } from '@jest/globals';
import { expectTrace } from '../..';
import { TraceLoop } from '../../trace-loop';
import { COMPARE_TYPE } from '../utils';

jest.setTimeout(30000);

describe('postgresql query', () => {
  let traceloop: TraceLoop;
  beforeAll(async () => {
    traceloop = new TraceLoop();

    await traceloop.axiosInstance.post('http://localhost:3000/orders/create');
    await traceloop.fetchTraces();
  });

  it('should see orders-service querying postgresql named postgres', async () => {
    expectTrace(traceloop.serviceByName('orders-service'))
      .toQueryPostgreSQL()
      .withDatabaseName('postgres', { compareType: COMPARE_TYPE.EQUALS });
  });

  it('should see orders-service querying postgresql named postgres and inserting an order with uuid as id and integer price_in_cents', async () => {
    expectTrace(traceloop.serviceByName('orders-service'))
      .toQueryPostgreSQL()
      .withDatabaseName('postgres', { compareType: COMPARE_TYPE.EQUALS })
      .withOperationAndTable('INSERT', 'orders')
      .withStatement(
        /INSERT INTO orders \(id, price_in_cents\) VALUES \('[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}', [0-9]+\)/,
        { compareType: COMPARE_TYPE.REGEX },
      );
  });
});
