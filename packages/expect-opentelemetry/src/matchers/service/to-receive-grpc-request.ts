import { SemanticAttributes } from '@opentelemetry/semantic-conventions';
import { Service } from '../../resources/service';
import { opentelemetry } from '@traceloop/otel-proto';
import { GrpcRequest } from '../../resources';

export function toReceiveGrpcRequest(service: Service): GrpcRequest {
  const { name: serviceName, spans } = service;
  const spanKind = opentelemetry.proto.trace.v1.Span.SpanKind.SPAN_KIND_SERVER;

  const filteredSpans = spans.filter(
    (span: opentelemetry.proto.trace.v1.ISpan) => {
      return (
        span.kind === spanKind &&
        span.attributes?.find(
          (attribute: opentelemetry.proto.common.v1.IKeyValue) => {
            return (
              attribute.key === SemanticAttributes.RPC_SYSTEM &&
              attribute.value?.stringValue === 'grpc'
            );
          },
        )
      );
    },
  );

  if (filteredSpans.length === 0) {
    throw new Error(`No gRPC call was received by ${serviceName}`);
  }

  return new GrpcRequest(filteredSpans, { serviceName, spanKind });
}
