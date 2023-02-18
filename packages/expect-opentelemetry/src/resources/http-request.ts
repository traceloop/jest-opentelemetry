import { SemanticAttributes } from '@opentelemetry/semantic-conventions';
import deepEqual from 'deep-equal';
import { opentelemetry } from '../proto';

export class HttpRequest {
  constructor(
    readonly spans: opentelemetry.proto.trace.v1.ISpan[],
    private readonly serviceName: string,
    private readonly spanKind: opentelemetry.proto.trace.v1.Span.SpanKind,
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

    return new HttpRequest(filteredSpans, this.serviceName, this.spanKind);
  }

  withHeader(key: string, value: string) {
    const filteredSpans = this.spans.filter((span) => {
      return span.attributes?.find(
        (attribute) =>
          attribute.key === `http.request.header.${key}` &&
          attribute.value?.stringValue === value,
      );
    });

    if (filteredSpans.length === 0) {
      throw new Error(
        `No HTTP call with header ${key} assigned with ${value} ${this.serviceErrorBySpanKind()}`,
      );
    }

    return new HttpRequest(filteredSpans, this.serviceName, this.spanKind);
  }

  ofMethod(method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH') {
    const filteredSpans = this.spans.filter((span) => {
      return span.attributes?.find(
        (attribute) =>
          attribute.key === SemanticAttributes.HTTP_METHOD &&
          attribute.value?.stringValue === method,
      );
    });

    if (filteredSpans.length === 0) {
      throw new Error(
        `No HTTP call of method ${method} ${this.serviceErrorBySpanKind()}`,
      );
    }

    return new HttpRequest(filteredSpans, this.serviceName, this.spanKind);
  }

  withStatusCode(code: number) {
    const filteredSpans = this.spans.filter((span) => {
      return span.attributes?.find(
        (attribute) =>
          attribute.key === SemanticAttributes.HTTP_STATUS_CODE &&
          attribute.value?.intValue === code,
      );
    });

    if (filteredSpans.length === 0) {
      throw new Error(
        `No HTTP call with status code ${code} ${this.serviceErrorBySpanKind()}`,
      );
    }

    return new HttpRequest(filteredSpans, this.serviceName, this.spanKind);
  }

  private serviceErrorBySpanKind() {
    switch (this.spanKind) {
      case opentelemetry.proto.trace.v1.Span.SpanKind.SPAN_KIND_CLIENT:
        return `was sent by ${this.serviceName}`;
      case opentelemetry.proto.trace.v1.Span.SpanKind.SPAN_KIND_SERVER:
        return `was received by ${this.serviceName}`;
      default:
        return `was found for ${this.serviceName}`;
    }
  }

  
}
