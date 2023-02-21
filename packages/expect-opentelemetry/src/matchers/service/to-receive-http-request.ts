import { SemanticAttributes } from '@opentelemetry/semantic-conventions';
import { HttpRequest } from '../../resources/http-request';
import { Service } from '../../resources/service';
import { opentelemetry } from '@traceloop/otel-proto';

export function toReceiveHttpRequest(service: Service): HttpRequest {
  const { name: serviceName, spans } = service;
  const spanKind = opentelemetry.proto.trace.v1.Span.SpanKind.SPAN_KIND_SERVER;

  const filteredSpans = spans.filter((span) => {
    return (
      span.kind === spanKind &&
      span.attributes?.find((attribute) => {
        return attribute.key === SemanticAttributes.HTTP_METHOD;
      })
    );
  });

  if (filteredSpans.length === 0) {
    throw new Error(`No HTTP call received by ${serviceName}`);
  }

  return new HttpRequest(filteredSpans, serviceName, spanKind);
}
