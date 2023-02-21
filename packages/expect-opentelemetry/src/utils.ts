import http from 'http';
import { opentelemetry } from '@traceloop/otel-proto';

export const getInstanceType = (instance: any) => {
  if (
    instance?.constructor?.name &&
    ['Span', 'Service'].includes(instance.constructor.name)
  ) {
    return instance.constructor.name;
  }

  return null;
};

export const enhanceError = (error: any, message: string) => {
  error.message = `${message}\n${error.message}`;
  return error;
};

export function parseServerResponse(
  data: any,
): opentelemetry.proto.trace.v1.TracesData {
  const tracesBinary = Buffer.from(data.traces, 'base64');

  return opentelemetry.proto.trace.v1.TracesData.decode(tracesBinary);
}

export const generateStubData = () => {
  const tracesData = opentelemetry.proto.trace.v1.TracesData.create();

  tracesData.resourceSpans.push(
    opentelemetry.proto.trace.v1.ResourceSpans.create({
      resource: opentelemetry.proto.resource.v1.Resource.create({
        attributes: [
          opentelemetry.proto.common.v1.KeyValue.create({
            key: 'service.name',
            value: opentelemetry.proto.common.v1.AnyValue.create({
              stringValue: 'orders-service',
            }),
          }),
        ],
      }),
      scopeSpans: [
        opentelemetry.proto.trace.v1.ScopeSpans.create({
          spans: [
            opentelemetry.proto.trace.v1.Span.create({
              traceId: Uint8Array.from(Buffer.from('AAAAAAAAAAAAAAAA', 'hex')),
              spanId: Uint8Array.from(Buffer.from('BBBBBBBBBBBBBBBB', 'hex')),
              name: 'orders-service',
              kind: opentelemetry.proto.trace.v1.Span.SpanKind.SPAN_KIND_CLIENT,
              startTimeUnixNano: 1630000000000000000,
              endTimeUnixNano: 1630000000000000000,
              attributes: [
                opentelemetry.proto.common.v1.KeyValue.create({
                  key: 'http.method',
                  value: opentelemetry.proto.common.v1.AnyValue.create({
                    stringValue: 'GET',
                  }),
                }),
                opentelemetry.proto.common.v1.KeyValue.create({
                  key: 'http.url',
                  value: opentelemetry.proto.common.v1.AnyValue.create({
                    stringValue: 'http://localhost:3000/orders',
                  }),
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  );

  return opentelemetry.proto.trace.v1.TracesData.encode(tracesData).finish();
};

/**
 * Promise wrapper for http.get
 * @see https://github.com/protobufjs/protobuf.js/wiki/How-to-read-binary-data-in-the-browser-or-under-node.js%3F
 *
 * @param url - url to make get request to (server that responds with Buffer)
 * @returns Buffer result
 */
export function httpGetBinary(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      const { statusCode } = res;

      if (!statusCode || statusCode < 200 || statusCode >= 300) {
        return reject(new Error('statusCode=' + res.statusCode));
      }

      const data: Uint8Array[] = [];
      res.on('data', function (chunk) {
        data.push(chunk as never);
      });
      res.on('end', function () {
        const result = Buffer.concat(data);
        resolve(result);
      });
    });
  });
}
