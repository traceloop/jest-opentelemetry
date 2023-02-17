import axios from 'axios';
import { setTimeout } from 'timers/promises';
import { Service } from './resources/service';
import { ReadableSpan } from '@opentelemetry/tracing';

export async function traces(fn: () => Promise<void>) {
  await setTimeout(4500);
  await fn();
  const t = new Trace();
  await t.init();
  return t;
}

export class Trace {
  private spans: ReadableSpan[] = [];

  async init() {
    const spans = await (
      await axios.get('http://localhost:4123/v1/traces')
    ).data;

    console.log('recieved spans', spans);
  }

  service(name: string): Service {
    console.log('this.spans', this.spans);

    return new Service(
      name,
      this.spans.filter((span) => span.name === name),
    );
  }
}
