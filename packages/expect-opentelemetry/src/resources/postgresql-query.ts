import { SemanticAttributes } from '@opentelemetry/semantic-conventions';
import { opentelemetry } from '@traceloop/otel-proto';
import {
  CompareOptions,
  filterByAttributeStringValue,
} from '../matchers/utils';

const tablesRegex = /(from|join|into|update|alter)\s+(?<table>\S+)/gi;

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

  withOperations(...operations: string[]) {
    const filteredSpans = this.spans.filter((span) => {
      const statement = span.attributes?.find(
        (attribute) => attribute.key === SemanticAttributes.DB_STATEMENT,
      )?.value?.stringValue;

      if (!statement) {
        return false;
      }

      const lowerCaseStatement = statement.toLowerCase();

      return operations.every((operation) =>
        lowerCaseStatement.includes(operation.toLowerCase()),
      );
    });

    if (filteredSpans.length === 0) {
      throw new Error(
        `No query by ${this.serviceName} to postgresql with operations ${operations} was found`,
      );
    }

    return new PostgreSQLQuery(filteredSpans, this.serviceName);
  }

  withTables(...tables: string[]) {
    const filteredSpans = this.spans.filter((span) => {
      const statement = span.attributes?.find(
        (attribute) => attribute.key === SemanticAttributes.DB_STATEMENT,
      )?.value?.stringValue;

      if (!statement) {
        return false;
      }

      const matches = statement.match(tablesRegex);
      const cleaned = matches?.map((elem: string) => {
        const [_, second] = elem.split(' ');
        return second
          .replace('"', '')
          .replace('(', '')
          .replace(')', '')
          .replace('\n', '')
          .toLocaleLowerCase();
      });

      return tables.every((table) =>
        cleaned?.includes(table.toLocaleLowerCase()),
      );
    });

    if (filteredSpans.length === 0) {
      throw new Error(
        `No query by ${this.serviceName} to postgresql with tables ${tables} was found`,
      );
    }

    return new PostgreSQLQuery(filteredSpans, this.serviceName);
  }
}
