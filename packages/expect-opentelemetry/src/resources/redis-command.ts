import { SemanticAttributes } from '@opentelemetry/semantic-conventions';
import { opentelemetry } from '@traceloop/otel-proto';
import {
  CompareOptions,
  filterByAttributeStringValue,
} from '../matchers/utils';

export class RedisCommand {
  constructor(
    readonly spans: opentelemetry.proto.trace.v1.ISpan[],
    private readonly serviceName: string,
    private readonly times = 1,
  ) {}

  withDatabaseName(name: string | RegExp, options: CompareOptions) {
    const filteredSpans = filterByAttributeStringValue(
      this.spans,
      SemanticAttributes.DB_NAME,
      name,
      options,
    );

    if (filteredSpans.length < this.times) {
      throw new Error(
        `Expected ${this.times} queries by ${this.serviceName} to redis with database name ${name}, but found ${filteredSpans.length}.`,
      );
    }

    return new RedisCommand(filteredSpans, this.serviceName);
  }

  withStatement(statement: string | RegExp, options: CompareOptions) {
    const filteredSpans = filterByAttributeStringValue(
      this.spans,
      SemanticAttributes.DB_STATEMENT,
      statement,
      options,
    );

    if (filteredSpans.length < this.times) {
      throw new Error(
        `Expected ${this.times} queries by ${this.serviceName} to redis with statement ${statement}, but found ${filteredSpans.length}.`,
      );
    }

    return new RedisCommand(filteredSpans, this.serviceName);
  }
}
