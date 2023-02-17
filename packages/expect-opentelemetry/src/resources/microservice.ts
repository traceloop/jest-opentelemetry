import { ReadableSpan } from '@opentelemetry/tracing';

export class Microservice {
  constructor(
    public readonly name: string,
    public readonly spans: ReadableSpan[],
  ) {}
}
