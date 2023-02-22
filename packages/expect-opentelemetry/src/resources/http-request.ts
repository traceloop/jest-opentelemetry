import { SemanticAttributes } from '@opentelemetry/semantic-conventions';
import { opentelemetry } from '@traceloop/otel-proto';
import {
  CompareOptions,
  filterByAttributeIntValue,
  filterByAttributeJSON,
  filterByAttributeStringValue,
  stringCompare,
} from '../matchers/utils';

export class HttpRequest {
  constructor(
    readonly spans: opentelemetry.proto.trace.v1.ISpan[],
    readonly extra: {
      serviceName: string;
      spanKind: opentelemetry.proto.trace.v1.Span.SpanKind;
    },
  ) {}

  withRequestBody(body: Record<string, unknown>, options?: CompareOptions) {
    const filteredSpans = filterByAttributeJSON(
      this.spans,
      'http.request.body',
      body,
      options,
    );

    if (filteredSpans.length === 0) {
      throw new Error(
        `No HTTP call with request body ${body} ${this.serviceErrorBySpanKind()}`,
      );
    }

    return new HttpRequest(filteredSpans, this.extra);
  }

  withResponseBody(body: Record<string, unknown>, options?: CompareOptions) {
    const filteredSpans = filterByAttributeJSON(
      this.spans,
      'http.response.body',
      body,
      options,
    );

    if (filteredSpans.length === 0) {
      throw new Error(
        `No HTTP call with response body ${body} ${this.serviceErrorBySpanKind()}`,
      );
    }

    return new HttpRequest(filteredSpans, this.extra);
  }

  withRequestHeader(key: string, value: string, options?: CompareOptions) {
    const filteredSpansBySingle = filterByAttributeStringValue(
      this.spans,
      `http.request.header.${key}`,
      value,
      options,
    );

    const headerObjectSpans = this.spans.filter((span) => {
      const attr = span.attributes?.find(
        (attribute) => attribute.key === 'http.request.headers',
      );
      try {
        const headerObject = JSON.parse(attr?.value?.stringValue ?? '');
        return stringCompare(headerObject[key], value);
      } catch (e) {
        return false;
      }
    });

    const filteredSpans = [...filteredSpansBySingle, ...headerObjectSpans];

    if (filteredSpans.length === 0) {
      throw new Error(
        `No HTTP call with request header ${key} assigned with ${value} ${this.serviceErrorBySpanKind()}`,
      );
    }

    return new HttpRequest(filteredSpans, this.extra);
  }

  withResponseHeader(key: string, value: string, options?: CompareOptions) {
    const filteredSpansBySingle = filterByAttributeStringValue(
      this.spans,
      `http.response.header.${key}`,
      value,
      options,
    );

    const headerObjectSpans = this.spans.filter((span) => {
      const attr = span.attributes?.find(
        (attribute) => attribute.key === 'http.response.headers',
      );
      try {
        const headerObject = JSON.parse(attr?.value?.stringValue ?? '');
        return stringCompare(headerObject[key], value);
      } catch (e) {
        return false;
      }
    });

    const filteredSpans = [...filteredSpansBySingle, ...headerObjectSpans];

    if (filteredSpans.length === 0) {
      throw new Error(
        `No HTTP call with response header ${key} assigned with ${value} ${this.serviceErrorBySpanKind()}`,
      );
    }

    return new HttpRequest(filteredSpans, this.extra);
  }

  withMethod(method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH') {
    const filteredSpans = filterByAttributeStringValue(
      this.spans,
      SemanticAttributes.HTTP_METHOD,
      method,
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

  withUrl(url: string, options?: CompareOptions) {
    const filteredSpans = filterByAttributeStringValue(
      this.spans,
      SemanticAttributes.HTTP_URL,
      url,
      options,
    );

    if (filteredSpans.length === 0) {
      throw new Error(
        `No HTTP call with url ${url} ${this.serviceErrorBySpanKind()}`,
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
