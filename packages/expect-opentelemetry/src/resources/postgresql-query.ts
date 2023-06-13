import { SemanticAttributes } from '@opentelemetry/semantic-conventions';
import { opentelemetry } from '@traceloop/otel-proto';
import {
  CompareOptions,
  filterByAttributeStringValue,
} from '../matchers/utils';

export class PostgreSQLQuery {
  constructor(
    readonly spans: opentelemetry.proto.trace.v1.ISpan[],
    private readonly serviceName: string,
  ) {}

  withDatabaseName(name: string | RegExp, options?: CompareOptions) {
    const filteredSpans = filterByAttributeStringValue(
      this.spans,
      SemanticAttributes.DB_NAME,
      name,
      options,
    );

    if (filteredSpans.length === 0) {
      throw new Error(
        `No query by ${this.serviceName} to postgresql with database name ${name} was found`,
      );
    }

    return new PostgreSQLQuery(filteredSpans, this.serviceName);
  }

  withStatement(statement: string | RegExp, options?: CompareOptions) {
    const filteredSpans = filterByAttributeStringValue(
      this.spans,
      SemanticAttributes.DB_STATEMENT,
      statement,
      options,
    );

    if (filteredSpans.length === 0) {
      throw new Error(
        `No query by ${this.serviceName} to postgresql with statement ${statement} was found`,
      );
    }

    return new PostgreSQLQuery(filteredSpans, this.serviceName);
  }

  withOperationAndTable(operation: string, table: string) {
    const filteredSpans = this.spans.filter((span) => {
      const statement = span.attributes?.find(
        (attribute) => attribute.key === SemanticAttributes.DB_STATEMENT,
      )?.value?.stringValue;

      if (!statement) {
        return false;
      }

      const regex = new RegExp( // naive initial implementation
        `${operation.toLocaleLowerCase()}.*${table.toLocaleLowerCase()}`,
      );

      return regex.test(statement.toLocaleLowerCase());
    });

    if (filteredSpans.length === 0) {
      throw new Error(
        `No query by ${this.serviceName} to postgresql with operation ${operation} and table ${table} was found`,
      );
    }

    return new PostgreSQLQuery(filteredSpans, this.serviceName);
  }
}
