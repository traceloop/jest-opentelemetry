import { SemanticAttributes } from '@opentelemetry/semantic-conventions';
import deepEqual from 'deep-equal';
import { opentelemetry } from '@traceloop/otel-proto';
import {
  CompareOptions,
  filterByAttributeIntValue,
  filterByAttributeStringValue,
} from '../matchers/utils';

export class HttpRequest {
  constructor(
    readonly spans: opentelemetry.proto.trace.v1.ISpan[],
    readonly extra: {
      serviceName: string;
      spanKind: opentelemetry.proto.trace.v1.Span.SpanKind;
    },
  ) {}

  withBody(body: object) {
    const filteredSpans = this.spans.filter((span) => {
      const jsonBody = JSON.parse(
        span.attributes?.find(
          (attribute) => attribute.key === 'http.request.body',
        )?.value?.stringValue || '',
      );

      return deepEqual(jsonBody, body);
    });

    if (filteredSpans.length === 0) {
      throw new Error(
        `No HTTP call with body ${body} ${this.serviceErrorBySpanKind()}`,
      );
    }

    return new HttpRequest(filteredSpans, this.extra);
  }

  withHeader(key: string, value: string, options: CompareOptions) {
    const filteredSpans = filterByAttributeStringValue(
      this.spans,
      `http.request.header.${key}`,
      value,
      options,
    );

    if (filteredSpans.length === 0) {
      throw new Error(
        `No HTTP call with header ${key} assigned with ${value} ${this.serviceErrorBySpanKind()}`,
      );
    }

    return new HttpRequest(filteredSpans, this.extra);
  }

  ofMethod(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    options?: CompareOptions,
  ) {
    const filteredSpans = filterByAttributeStringValue(
      this.spans,
      SemanticAttributes.HTTP_METHOD,
      method,
      options,
    );

    if (filteredSpans.length === 0) {
      throw new Error(
        `No HTTP call of method ${method} ${this.serviceErrorBySpanKind()}`,
      );
    }

    return new HttpRequest(filteredSpans, this.extra);
  }

  withStatusCode(code: number) {
    const filteredSpans = filterByAttributeIntValue(
      this.spans,
      SemanticAttributes.HTTP_STATUS_CODE,
      code,
    );

    if (filteredSpans.length === 0) {
      throw new Error(
        `No HTTP call with status code ${code} ${this.serviceErrorBySpanKind()}`,
      );
    }

    return new HttpRequest(filteredSpans, this.extra);
  }

  private serviceErrorBySpanKind() {
    switch (this.extra.spanKind) {
      case opentelemetry.proto.trace.v1.Span.SpanKind.SPAN_KIND_CLIENT:
        return `was sent by ${this.extra.serviceName}`;
      case opentelemetry.proto.trace.v1.Span.SpanKind.SPAN_KIND_SERVER:
        return `was received by ${this.extra.serviceName}`;
      default:
        return `was found for ${this.extra.serviceName}`;
    }
  }
}
