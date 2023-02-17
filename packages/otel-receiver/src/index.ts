import express, { Express, Request, Response } from 'express';
import { addToStore, getAll } from './store';

const port = Number(process.env.TRACE_SERVER_PORT) || 4123;

const app: Express = express();
app.use(express.json({ limit: '200mb' }));

app.post('/v1/traces', (req: Request, res: Response) => {
  req.body.resourceSpans.forEach((resourceSpan: any) => {
    addToStore(resourceSpan);
  });

  res.send();
});

app.get('/v1/traces', (_: Request, res: Response) => {
  res.send(getAll());
});

const server = app.listen(port, () => {
  console.log(`Example app listening at port ${port}`);
});
