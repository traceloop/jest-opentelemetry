import { SemanticAttributes } from '@opentelemetry/semantic-conventions';
import { Service } from '../../resources/service';
import { opentelemetry } from '@traceloop/otel-proto';
import { PostgreSQLQuery } from '../../resources/postgresql-query';

export function toQueryPostgreSQL(
  service: Service,
  options = { times: 1 },
): PostgreSQLQuery {
  const { name: serviceName, spans } = service;

  const filteredSpans = spans.filter((span) => {
    return (
      span.kind ===
        opentelemetry.proto.trace.v1.Span.SpanKind.SPAN_KIND_CLIENT &&
      span.attributes?.find(
        (attribute: opentelemetry.proto.common.v1.IKeyValue) => {
          return (
            attribute.key === SemanticAttributes.DB_SYSTEM &&
            attribute.value?.stringValue === 'postgresql'
          );
        },
      )
    );
  });

  if (filteredSpans.length < options.times) {
    throw new Error(
      `Expected ${options.times} queries by ${serviceName} to postgresql, but found ${filteredSpans.length}.`,
    );
  }

  return new PostgreSQLQuery(filteredSpans, serviceName, options.times);
}
