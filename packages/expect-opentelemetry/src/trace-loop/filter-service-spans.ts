import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { opentelemetry } from '@traceloop/otel-proto';
import { stringCompare, CompareOptions } from '../matchers/utils';

const flatten = (
  serviceResourceSpans: opentelemetry.proto.trace.v1.IResourceSpans | undefined,
) => serviceResourceSpans?.scopeSpans?.flatMap((ss) => ss.spans || []);

const filterByTraceId = (
  spans: opentelemetry.proto.trace.v1.ISpan[] | undefined = [],
  traceId: string | undefined,
) => {
  if (!traceId) {
    return spans;
  }

  return (
    spans.filter(
      (span) =>
        span.traceId && Buffer.from(span.traceId).toString('hex') === traceId,
    ) || []
  );
};

export const byCustomAttribute = (
  attName: string,
  attValue: string | RegExp,
  traceData: opentelemetry.proto.trace.v1.TracesData | undefined,
  traceId: string | undefined,
  options?: CompareOptions,
) => {
  const serviceResourceSpans = traceData?.resourceSpans?.find((rs) =>
    rs.resource?.attributes?.find(
      (a) =>
        a.key === attName &&
        stringCompare(a.value?.stringValue, attValue, options),
    ),
  );

  return filterByTraceId(flatten(serviceResourceSpans), traceId);
};

export const byServiceName = (
  name: string,
  traceData: opentelemetry.proto.trace.v1.TracesData | undefined,
  traceId: string | undefined,
  options?: CompareOptions,
) =>
  byCustomAttribute(
    SemanticResourceAttributes.SERVICE_NAME,
    name,
    traceData,
    traceId,
    options,
  );

export const byK8sPodName = (
  name: string,
  traceData: opentelemetry.proto.trace.v1.TracesData | undefined,
  traceId: string | undefined,
  options?: CompareOptions,
) =>
  byCustomAttribute(
    SemanticResourceAttributes.K8S_POD_NAME,
    name,
    traceData,
    traceId,
    options,
  );
