import { SemanticAttributes } from '@opentelemetry/semantic-conventions';
import { HttpRequest } from '../../resources/http-request';
import { Service } from '../../resources/service';
import { opentelemetry } from '../../../../../proto';

export function toSendHttpRequest(service: Service): HttpRequest {
  const { name: serviceName, spans } = service;
  const spanKind = opentelemetry.proto.trace.v1.Span.SpanKind.SPAN_KIND_CLIENT;

  const filteredSpans = spans.filter((span) => {
    return (
      span.kind === spanKind &&
      span.attributes?.find((attribute) => {
        return attribute.key === SemanticAttributes.HTTP_METHOD;
      })
    );
  });

  if (filteredSpans.length === 0) {
    throw new Error(`No HTTP call was sent by ${serviceName}`);
  }

  return new HttpRequest(filteredSpans, serviceName, spanKind);
}

declare module 'expect' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Matchers<R> {
    toSendHttpRequest(): HttpRequest;
  }
}
