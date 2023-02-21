import { randomUUID } from 'crypto';
import axios from 'axios';
import { opentelemetry } from '../../../../proto';
import { httpGetBinary } from '../utils';
import { setTimeout } from 'timers/promises';
import {
  fetchTracesConfigBase,
  FetchTracesConfig,
  pollForTraceLoopIdMatch,
  rejectAfterTimeout,
} from './fetch-traces';
import { Service } from '../resources/service';

const TRACE_LOOP_ID_HEADER = 'trace-loop-id';

export class TraceLoop {
  private _traceLoopId: string;
  private _fetchedTrace = false;
  private _traceId;
  private _traceData: opentelemetry.proto.trace.v1.TracesData | undefined;

  constructor() {
    this._traceLoopId = randomUUID();
  }

  get traceLoopId() {
    return this._traceLoopId;
  }

  get traceLoopHeaderName() {
    return TRACE_LOOP_ID_HEADER;
  }

  get axiosInstance() {
    return axios.create({
      headers: { [TRACE_LOOP_ID_HEADER]: this._traceLoopId },
    });
  }

  /**
   * Fetches all traces for the current trace loop id from the otel receiver
   * @param config
   */
  public async fetchTraces(
    inputConfig: Partial<FetchTracesConfig> = {},
  ): Promise<void> {
    const config = { ...fetchTracesConfigBase, ...inputConfig };
    if (this._fetchedTrace) {
      return;
    }

    this._traceId = await Promise.race([
      pollForTraceLoopIdMatch(config, this._traceLoopId),
      rejectAfterTimeout(config),
    ]);

    // allow time for all spans for the current trace to be received
    await setTimeout(config.awaitAllTracesTimeout);

    const response = await httpGetBinary(config.url);
    const traces = opentelemetry.proto.trace.v1.TracesData.decode(response);
    this._traceData = traces;
    this._fetchedTrace = true;
  }

  /**
   * Returns a Service object for the given service name and relevant trace id
   * @param name service name (must match the service.name attribute)
   * @returns
   */
  service(name: string): Service {
    const serviceResourceSpans = this._traceData?.resourceSpans?.find((rs) =>
      rs.resource?.attributes?.find(
        (a) => a.key === 'service.name' && a.value?.stringValue === name,
      ),
    );

    // return only spans for the requested service + relevant trace id
    const serviceSpans =
      serviceResourceSpans?.scopeSpans
        ?.flatMap((ss) => ss.spans || [])
        .filter(
          (span) =>
            span.traceId &&
            Buffer.from(span.traceId).toString('hex') === this._traceId,
        ) || [];

    return new Service(name, serviceSpans || []);
  }
}
