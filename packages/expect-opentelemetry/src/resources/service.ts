import { ISpan } from '@opentelemetry/otlp-transformer';

export class Service {
  constructor(
    public readonly name: string,
    public readonly spans: ISpan[],
  ) {}
}
