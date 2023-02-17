import { SpanKind } from '@opentelemetry/api';
import { SemanticAttributes } from '@opentelemetry/semantic-conventions';
import { ReadableSpan } from '@opentelemetry/tracing';
import deepEqual from 'deep-equal';

export class HttpRequest {
  constructor(
    readonly spans: ReadableSpan[],
    private readonly serviceName: string,
    private readonly spanKind: SpanKind,
  ) {}

  withBody(body: object) {
    const filteredSpans = this.spans.filter((span) => {
      const jsonBody = JSON.parse(
        span.attributes['http.request.body'] as string,
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
      return span.attributes[`http.request.header.${key}`] === value;
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
      return span.attributes[SemanticAttributes.HTTP_METHOD] === method;
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
      return span.attributes[SemanticAttributes.HTTP_STATUS_CODE] === code;
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
      case SpanKind.CLIENT:
        return `was sent by ${this.serviceName}`;
      case SpanKind.SERVER:
        return `was received by ${this.serviceName}`;
      default:
        return `was found for ${this.serviceName}`;
    }
  }
}
