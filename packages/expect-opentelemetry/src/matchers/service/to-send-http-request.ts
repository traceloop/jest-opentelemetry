import { SpanKind } from '@opentelemetry/api';
import { SemanticAttributes } from '@opentelemetry/semantic-conventions';
import { HttpRequest } from '../../resources/http-request';
import { Service } from '../../resources/service';

export function toSendHttpRequest(service: Service): HttpRequest {
  const { name: serviceName, spans } = service;
  const spanKind = SpanKind.CLIENT;

  const filteredSpans = spans.filter((span) => {
    return (
      span.kind === spanKind && span.attributes[SemanticAttributes.HTTP_METHOD]
    );
  });

  if (filteredSpans.length === 0) {
    throw new Error(`No HTTP call was sent by ${serviceName}`);
  }

  return new HttpRequest(filteredSpans, serviceName, spanKind);
}
