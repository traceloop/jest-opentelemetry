import { setTimeout } from 'timers/promises';
import { Service } from './resources/service';
import { opentelemetry } from '../../../proto';
import { promiseHttpGet } from './utils';

export class Trace {
  private tracesData: opentelemetry.proto.trace.v1.ITracesData | undefined;

  static async trigger(fn: () => Promise<void>) {
    const trace = new Trace();

    await fn();
    await setTimeout(5000);
    await trace.capture();

    return trace;
  }

  async capture() {
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
