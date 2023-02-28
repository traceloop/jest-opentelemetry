import { opentelemetry } from '@traceloop/otel-proto';
import { setTimeout } from 'timers/promises';
import { httpGetBinary } from '../utils';

const TRACELOOP_ID_REQUEST_HEADER = 'http.request.header.traceloop_id';
const TRACELOOP_ID_RESPONSE_HEADER = 'http.response.header.traceloop_id';

export interface FetchTracesConfig {
  maxPollTime: number;
  pollInterval: number;
  awaitAllTracesTimeout: number;
  url: string;
  customerId: string;
}

export const fetchTracesConfigBase: FetchTracesConfig = {
  maxPollTime: 120000,
  pollInterval: 1000,
  awaitAllTracesTimeout: 1000,
  url: 'http://localhost:4123/v1/traces',
  customerId: 'local',
};

/**
 * Searches in the traces for a trace with the given traceLoopId contained in the attribute http.request.header.trace_loop_id
 *
 * @param traces all traces from the otel receiver
 * @param traceLoopId traceLoopId to search for
 * @returns traceId of the span with the given traceLoopId or undefined if no match was found
 */
export const findTraceLoopIdMatch = (
  traces: opentelemetry.proto.trace.v1.TracesData,
  traceLoopId: string,
): string | undefined => {
  for (const resourceSpan of traces.resourceSpans) {
    for (const scopeSpan of resourceSpan.scopeSpans || []) {
      for (const span of scopeSpan.spans || []) {
        if (span.attributes) {
          for (const attribute of span.attributes) {
            // http: check in headers stringified json
            if (attribute.key === 'http.request.headers') {
              const matches = attribute.value?.stringValue?.match(
                /"traceloop_id":"(.*)"/,
              );
              if (matches?.length > 1) {
                if (matches[1] === traceLoopId) {
                  return span.traceId
                    ? Buffer.from(span.traceId).toString('hex')
                    : undefined;
                }
              }
            }

            // check in specific header key
            if (
              attribute.key === TRACELOOP_ID_REQUEST_HEADER ||
              attribute.key === TRACELOOP_ID_RESPONSE_HEADER
            ) {
              if (
                attribute.value?.arrayValue?.values?.[0]?.stringValue ===
                traceLoopId
              ) {
                return span.traceId
                  ? Buffer.from(span.traceId).toString('hex')
                  : undefined;
              }
            }
          }
        }
      }
    }
  }
};

export const pollForTraceLoopIdMatch = async (
  config: FetchTracesConfig,
  traceLoopId: string,
): Promise<string | undefined> => {
  let foundMatch = false;
  while (!foundMatch) {
    await setTimeout(config.pollInterval);
    try {
      const response = await httpGetBinary(config, traceLoopId);
      const traces = opentelemetry.proto.trace.v1.TracesData.decode(response);

      const traceId = findTraceLoopIdMatch(traces, traceLoopId);
      if (traceId) {
        foundMatch = true;
        return traceId;
      }
    } catch (e) {
      // retry on 400, else throw
      if ((e as Error)?.message !== '400') {
        throw e;
      }
    }
  }
};

export const resolveAfterTimeout = async (config: FetchTracesConfig) => {
  return new Promise((resolve, _) => {
    setTimeout(config.maxPollTime).then(() => {
      resolve(undefined);
    });
  });
};
