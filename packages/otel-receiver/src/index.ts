import express, { Request, Response } from 'express';
import { addToStore, getAll } from './store';
import { opentelemetry } from '@traceloop/otel-proto';

const app = express();
const port = 4123;
let _server;

const startServer = async () => {
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

  app.get('/v1/traces/:traceloopId', (_: Request, res: Response) => {
    res.send(getAll());
  });

  app.get('/ping', (_: Request, res: Response) => {
    res.send('pong');
  });

  _server = app.listen(port, () => {
    console.log(`otel-receiver listening at port ${port}`);
  });
};

const gracefulShutdownHandler = function gracefulShutdownHandler(signal) {
  console.log(`otel-receiver caught ${signal}, gracefully shutting down`);

  setTimeout(() => {
    _server.close(function () {
      process.exit();
    });
  }, 0);
};

process.on('SIGINT', gracefulShutdownHandler);
process.on('SIGTERM', gracefulShutdownHandler);

startServer();
