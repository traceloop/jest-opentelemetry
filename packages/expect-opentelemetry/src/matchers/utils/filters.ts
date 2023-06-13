import { opentelemetry } from '@traceloop/otel-proto';
import { objectCompare, stringCompare } from './comparators';
import { CompareOptions } from './compare-types';

export const filterByAttributeKey = (
  spans: opentelemetry.proto.trace.v1.ISpan[],
  attName: string,
) =>
  spans.filter((span) => {
    return span.attributes?.find((attribute) => {
      return attribute.key === attName;
    });
  });

export const filterBySpanKind = (
  spans: opentelemetry.proto.trace.v1.ISpan[],
  expected: opentelemetry.proto.trace.v1.Span.SpanKind,
) => spans.filter((span) => span.kind === expected);

export const filterByAttributeStringValue = (
  spans: opentelemetry.proto.trace.v1.ISpan[],
  attName: string,
  attValue: string | RegExp,
  options?: CompareOptions,
) =>
  spans.filter((span) => {
    return span.attributes?.find(
      (attribute) =>
        attribute.key === attName &&
        stringCompare(attribute.value?.stringValue, attValue, options),
    );
  });

export const filterByAttributeIntValue = (
  spans: opentelemetry.proto.trace.v1.ISpan[],
  attName: string,
  attValue: number,
) =>
  spans.filter((span) => {
    return span.attributes?.find(
      (attribute) =>
        attribute.key === attName &&
        attribute.value?.intValue.toNumber() === attValue,
    );
  });

export const filterByAttributeJSON = (
  spans: opentelemetry.proto.trace.v1.ISpan[],
  attName: string,
  attValue: Record<string, unknown>,
  options?: CompareOptions,
) =>
  spans.filter((span) => {
    try {
      const json = JSON.parse(
        span.attributes?.find((attribute) => attribute.key === attName)?.value
          ?.stringValue || '',
      );

      return objectCompare(json, attValue, options);
    } catch (e) {
      return false;
    }
  });
