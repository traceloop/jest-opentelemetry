import { opentelemetry } from './proto';

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

  return {
    traces: Buffer.from(
      opentelemetry.proto.trace.v1.TracesData.encode(tracesData).finish(),
    ).toString('base64'),
  };
};
