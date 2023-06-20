import { SemanticAttributes } from '@opentelemetry/semantic-conventions';
import { opentelemetry } from '@traceloop/otel-proto';
import { RedisCommand, Service } from '../../resources';

export function toSendRedisCommand(
  service: Service,
  options = { times: 1 },
): RedisCommand {
  const { name: serviceName, spans } = service;

  const filteredSpans = spans.filter((span) => {
    return (
      span.kind ===
        opentelemetry.proto.trace.v1.Span.SpanKind.SPAN_KIND_CLIENT &&
      span.attributes?.find(
        (attribute: opentelemetry.proto.common.v1.IKeyValue) => {
          return (
            attribute.key === SemanticAttributes.DB_SYSTEM &&
            attribute.value?.stringValue === 'redis'
          );
        },
      )
    );
  });

  if (filteredSpans.length < options.times) {
    throw new Error(
      `Expected ${options.times} queries by ${serviceName} to redis, but found ${filteredSpans.length}.`,
    );
  }

  return new RedisCommand(filteredSpans, serviceName, options.times);
}
