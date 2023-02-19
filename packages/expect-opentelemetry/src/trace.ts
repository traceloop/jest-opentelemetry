import { setTimeout } from 'timers/promises';
import { Service } from './resources/service';
import { opentelemetry } from '../../../proto';
import { promiseHttpGet } from './utils';

export async function traces(fn: () => Promise<void>) {
  await setTimeout(5000);
  await fn();
  await setTimeout(20000);
  const t = new Trace();
  await t.init();
  return t;
}

export class Trace {
  private tracesData: opentelemetry.proto.trace.v1.ITracesData | undefined;

  async init() {
    const response = await promiseHttpGet('http://localhost:4123/v1/traces');

    this.tracesData = opentelemetry.proto.trace.v1.TracesData.decode(response);
  }

  service(name: string): Service {
    const serviceResourceSpans = this.tracesData?.resourceSpans?.find((rs) =>
      rs.resource?.attributes?.find(
        (a) => a.key === 'service.name' && a.value?.stringValue === name,
      ),
    );

    const serviceSpans =
      serviceResourceSpans?.scopeSpans?.flatMap((ss) => ss.spans || []) || [];

    return new Service(name, serviceSpans);
  }
}
