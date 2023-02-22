import { SemanticAttributes } from '@opentelemetry/semantic-conventions';
import { Service } from '../../resources/service';
import { opentelemetry } from '@traceloop/otel-proto';
import { PostgresQLQuery } from '../../resources/postgresql-query';

export function toQueryPostgresQL(service: Service): PostgresQLQuery {
  const { name: serviceName, spans } = service;

  const filteredSpans = spans.filter((span) => {
    return (
      span.kind ===
        opentelemetry.proto.trace.v1.Span.SpanKind.SPAN_KIND_CLIENT &&
      span.attributes?.find((attribute) => {
        return (
          attribute.key === SemanticAttributes.DB_SYSTEM &&
          attribute.value?.stringValue === 'postgresql'
        );
      })
    );
  });

  if (filteredSpans.length === 0) {
    throw new Error(`No query by ${serviceName} to postgresql was found`);
  }

  return new PostgresQLQuery(filteredSpans, serviceName);
}
