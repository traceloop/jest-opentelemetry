import axios from 'axios';
import { setTimeout } from 'timers/promises';
import { Service } from './resources/service';
import { ReadableSpan } from '@opentelemetry/tracing';

export async function traces(fn: () => Promise<void>) {
  await setTimeout(1000);
  await fn();
  await setTimeout(10000);
  const t = new Trace();
  await t.init();
  return t;
}

export class Trace {
  private spans: ReadableSpan[] = [];

  async init() {
    const response = await (
      await axios.get('http://localhost:4123/v1/traces')
    ).data;

    response.forEach((trace: any) => this.spans.push(...trace.spans));
  }

  service(name: string): Service {
    return new Service(
      name,
      this.spans, //.filter((span) => span.name === name),
    );
  }
}
