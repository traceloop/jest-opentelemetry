import { SemanticAttributes } from '@opentelemetry/semantic-conventions';
import { opentelemetry } from '@traceloop/otel-proto';

export class PostgresQLQuery {
  constructor(
    readonly spans: opentelemetry.proto.trace.v1.ISpan[],
    private readonly serviceName: string,
  ) {}

  withDatabaseName(name: string) {
    const filteredSpans = this.spans.filter((span) => {
      return span.attributes?.find(
        (attribute) =>
          attribute.key === SemanticAttributes.DB_NAME &&
          attribute.value?.stringValue === name,
      );
    });

    if (filteredSpans.length === 0) {
      throw new Error(
        `No query by ${this.serviceName} to postgresql with database name ${name} was found`,
      );
    }

    return new PostgresQLQuery(filteredSpans, this.serviceName);
  }
}
