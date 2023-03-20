import { randomUUID } from 'crypto';
import axios from 'axios';
import { opentelemetry } from '@traceloop/otel-proto';
import { httpGetBinary } from '../utils';
import { setTimeout } from 'timers/promises';
import {
  fetchTracesConfigBase,
  FetchTracesConfig,
  pollForTraceLoopIdMatch,
  resolveAfterTimeout,
} from './fetch-traces';
import { Service } from '../resources/service';
import { CompareOptions } from '../matchers/utils/compare-types';
import {
  byK8sPodName,
  byServiceName,
  byCustomAttribute,
} from './filter-service-spans';

const TRACE_LOOP_ID_HEADER = 'traceloop_id';

export class TraceLoop {
  private readonly _traceLoopId: string;
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
      resolveAfterTimeout(config),
    ]);

    // allow time for all spans for the current trace to be received
    await setTimeout(config.awaitAllSpansInTraceTimeout);

    const response = await httpGetBinary(config, this._traceLoopId);
    this._traceData = opentelemetry.proto.trace.v1.TracesData.decode(response);
    this._fetchedTrace = true;
  }

  public serviceByName(name: string, options?: CompareOptions) {
    return new Service(
      name,
      byServiceName(name, this._traceData, this._traceId, options),
    );
  }

  public serviceByK8sPodName(name: string, options?: CompareOptions) {
    return new Service(
      name,
      byK8sPodName(name, this._traceData, this._traceId, options),
    );
  }

  public serviceByCustomAttribute(
    key: string,
    value: string | RegExp,
    options?: CompareOptions,
  ) {
    return new Service(
      value as string,
      byCustomAttribute(key, value, this._traceData, this._traceId, options),
    );
  }
}
