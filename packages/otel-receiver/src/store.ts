import { opentelemetry } from '@traceloop/otel-proto';

const _resourceSpans: opentelemetry.proto.trace.v1.IResourceSpans[] = [];

export const addToStore = (
  resourceSpans: opentelemetry.proto.trace.v1.IResourceSpans[],
) => {
  _resourceSpans.push(...resourceSpans);
};

export const getAll = () => {
  const tracesData = new opentelemetry.proto.trace.v1.TracesData({
    resourceSpans: _resourceSpans,
  });

  return opentelemetry.proto.trace.v1.TracesData.encode(tracesData).finish();
};
