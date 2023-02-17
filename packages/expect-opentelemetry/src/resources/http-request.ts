import { ReadableSpan } from '@opentelemetry/tracing';

export class HttpRequest {
  constructor(private serviceName, private readonly spans: ReadableSpan[]) {}

  withBody(body: object) {
    throw new Error('Not implemented');
  }

  withBodyParam(body: object) {
    throw new Error('Not implemented');
  }

  withHeaders(body: object) {
    throw new Error('Not implemented');
  }

  withHeader(key: string, value: string) {
    throw new Error('Not implemented');
  }

  ofMethod(method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH') {
    const filteredSpans = this.spans.filter((span) => {
      return span.attributes['http.method'] === method;
    });

    if (filteredSpans.length === 0) {
      throw new Error(
        `No HTTP call of method ${method} received by ${this.serviceName}`,
      );
    }

    return new HttpRequest(this.serviceName, filteredSpans);
  }

  withStatusCode(code: number) {
    const filteredSpans = this.spans.filter((span) => {
      return span.status.code === code;
    });

    if (filteredSpans.length === 0) {
      throw new Error(
        `No HTTP call with status code ${code} received by ${this.serviceName}`,
      );
    }

    return new HttpRequest(this.serviceName, filteredSpans);
  }
}
