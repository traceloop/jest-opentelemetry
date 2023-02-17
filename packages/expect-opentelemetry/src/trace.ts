import axios from 'axios';
import { setTimeout } from 'timers/promises';
import { Service } from './resources/service';
import { ReadableSpan } from '@opentelemetry/tracing';

export async function traces(fn: () => Promise<void>) {
  await fn();
  const t = new Trace();
  await t.init();
  return t;
}

export class Trace {
  private spans: ReadableSpan[] = [];

  async init() {
    await setTimeout(2000);

    this.spans = await axios.get('http://localhost:4123/v1/traces');
  }

  service(name: string): Service {
    return new Service(
      name,
      this.spans.filter((span) => span.name === name),
    );
  }
}
