import express, { Request, Response } from 'express';
import { addToStore, getAll } from './store';
import { opentelemetry } from './proto';

const app = express();
const port = 4123;

const run = async () => {
  app.post(
    '/v1/traces',
    express.raw({ type: '*/*' }),
    (req: Request, res: Response) => {
      const tracesData = opentelemetry.proto.trace.v1.TracesData.decode(
        req.body,
      );

      addToStore(tracesData.resourceSpans);

      res.send();
    },
  );

  app.get('/v1/traces', (_: Request, res: Response) => {
    res.send(getAll());
  });

  app.listen(port, () => {
    console.log(`otel-receiver listening at port ${port}`);
  });
};

run();
