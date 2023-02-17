import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { ReadableSpan } from '@opentelemetry/tracing';

interface Resource {
  attributes: Record<string, unknown>;
}

interface ScopeSpan {
  scope: Record<string, unknown>;
  spans: ReadableSpan[];
}

interface ResourceSpan {
  resource: Resource;
  scopeSpans: ScopeSpan[];
}

const _spans: Record<string, { resource: Resource; spans: ReadableSpan[] }> =
  {};

/**
 * Creates a unique key for a resource
 * @param resourceAttributes - resource to create key for
 * @returns resource key
 */
const resourceKey = (resourceAttributes: Record<string, unknown>) =>
  `${resourceAttributes[SemanticResourceAttributes.SERVICE_NAME]}:${
    resourceAttributes[SemanticResourceAttributes.PROCESS_COMMAND_LINE]
  }`;

export const addToStore = (resourceSpan: ResourceSpan) => {
  const key = resourceKey(resourceSpan.resource.attributes);
  const spanArr: ReadableSpan[] = [];
  resourceSpan.scopeSpans.forEach((scopeSpan) => {
    spanArr.push(...scopeSpan.spans);
  });

  if (_spans[key]) {
    _spans[key].spans.push(...spanArr);
  } else {
    _spans[key] = { resource: resourceSpan.resource, spans: spanArr };
  }
};

export const getAll = () => Object.values(_spans);
