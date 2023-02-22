import { opentelemetry } from '@traceloop/otel-proto';

export class Service {
  constructor(
    public readonly name: string,
    public readonly spans: opentelemetry.proto.trace.v1.ISpan[],
  ) {}
}
