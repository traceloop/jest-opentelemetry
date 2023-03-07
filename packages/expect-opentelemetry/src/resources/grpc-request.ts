import { SemanticAttributes } from '@opentelemetry/semantic-conventions';
import { opentelemetry } from '@traceloop/otel-proto';
import {
  CompareOptions,
  filterByAttributeIntValue,
  filterByAttributeStringValue,
} from '../matchers/utils';

const STATUS_CODE = {
  OK: 0,
  CANCELLED: 1,
  UNKNOWN: 2,
  INVALID_ARGUMENT: 3,
  DEADLINE_EXCEEDED: 4,
  NOT_FOUND: 5,
  ALREADY_EXISTS: 6,
  PERMISSION_DENIED: 7,
  RESOURCE_EXHAUSTED: 8,
  FAILED_PRECONDITION: 9,
  ABORTED: 10,
  OUT_OF_RANGE: 11,
  UNIMPLEMENTED: 12,
  INTERNAL: 13,
  UNAVAILABLE: 14,
  DATA_LOSS: 15,
  UNAUTHENTICATED: 16,
} as const;

type StatusCode = (typeof STATUS_CODE)[keyof typeof STATUS_CODE];

export class GrpcRequest {
  static readonly GRPC_STATUS_CODE = STATUS_CODE;

  constructor(
    readonly spans: opentelemetry.proto.trace.v1.ISpan[],
    readonly extra: {
      serviceName: string;
      spanKind: opentelemetry.proto.trace.v1.Span.SpanKind;
    },
  ) {}

  withRpcMethod(method: string, options?: CompareOptions) {
    const filteredSpans = filterByAttributeStringValue(
      this.spans,
      SemanticAttributes.RPC_METHOD,
      method,
      options,
    );

    if (filteredSpans.length === 0) {
      throw new Error(
        `No gRPC call of method ${method} ${this.serviceErrorBySpanKind()}`,
      );
    }

    return new GrpcRequest(filteredSpans, this.extra);
  }

  withRpcService(service: string, options?: CompareOptions) {
    const filteredSpans = filterByAttributeStringValue(
      this.spans,
      SemanticAttributes.RPC_SERVICE,
      service,
      options,
    );

    if (filteredSpans.length === 0) {
      throw new Error(
        `No gRPC call for service ${service} ${this.serviceErrorBySpanKind()}`,
      );
    }

    return new GrpcRequest(filteredSpans, this.extra);
  }

  withRpcGrpcStatusCode(code: StatusCode) {
    const filteredSpans = filterByAttributeIntValue(
      this.spans,
      SemanticAttributes.RPC_GRPC_STATUS_CODE,
      code,
    );

    // spec says it should be an int, but in practice we get strings
    const filteredSpansString = filterByAttributeStringValue(
      this.spans,
      SemanticAttributes.RPC_GRPC_STATUS_CODE,
      code.toString(),
    );

    if (filteredSpans.length === 0 && filteredSpansString.length === 0) {
      throw new Error(
        `No gRPC call with status code ${code} ${this.serviceErrorBySpanKind()}`,
      );
    }

    return new GrpcRequest(
      filteredSpans.length !== 0 ? filteredSpans : filteredSpansString,
      this.extra,
    );
  }

  withNetPeerName(netPeerName: string, options?: CompareOptions) {
    const filteredSpans = filterByAttributeStringValue(
      this.spans,
      SemanticAttributes.NET_PEER_NAME,
      netPeerName,
      options,
    );

    if (filteredSpans.length === 0) {
      throw new Error(
        `No gRPC call with net peer name (host name) ${netPeerName} ${this.serviceErrorBySpanKind()}`,
      );
    }

    return new GrpcRequest(filteredSpans, this.extra);
  }

  withHostName(hostName: string, options?: CompareOptions) {
    return this.withNetPeerName(hostName, options);
  }

  private serviceErrorBySpanKind() {
    const { SPAN_KIND_CLIENT, SPAN_KIND_SERVER } =
      opentelemetry.proto.trace.v1.Span.SpanKind;
    const { spanKind, serviceName } = this.extra;

    switch (spanKind) {
      case SPAN_KIND_CLIENT:
        return `was sent by ${serviceName}`;
      case SPAN_KIND_SERVER:
        return `was received by ${serviceName}`;
      default:
        return `was found for ${serviceName}`;
    }
  }
}
