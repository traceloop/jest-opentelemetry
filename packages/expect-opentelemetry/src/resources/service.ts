import { ReadableSpan } from '@opentelemetry/tracing';

export class Service {
  constructor(
    public readonly name: string,
    public readonly spans: ReadableSpan[],
  ) {}
}
