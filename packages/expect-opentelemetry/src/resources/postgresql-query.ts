import { SemanticAttributes } from '@opentelemetry/semantic-conventions';
import { opentelemetry } from '@traceloop/otel-proto';
import {
  CompareOptions,
  extractAttributeStringValues,
  filterByAttributeStringValue,
} from '../matchers/utils';

const tablesRegex = /(from|join|into|update|alter)\s+(?<table>\S+)/gi;

export class PostgreSQLQuery {
  constructor(
    readonly spans: opentelemetry.proto.trace.v1.ISpan[],
    private readonly serviceName: string,
    private readonly times = 1,
  ) {}

  withDatabaseName(name: string | RegExp, options?: CompareOptions) {
    const filteredSpans = filterByAttributeStringValue(
      this.spans,
      SemanticAttributes.DB_NAME,
      name,
      options,
    );

    if (filteredSpans.length < this.times) {
      throw new Error(`Expected ${this.times} queries by ${
        this.serviceName
      } to postgresql with database name ${name}, but found ${
        filteredSpans.length
      }.\n
      Found db names:\n ${extractAttributeStringValues(
        this.spans,
        SemanticAttributes.DB_NAME,
      )}`);
    }

    return new PostgreSQLQuery(filteredSpans, this.serviceName, this.times);
  }

  withStatement(statement: string | RegExp, options?: CompareOptions) {
    const filteredSpans = filterByAttributeStringValue(
      this.spans,
      SemanticAttributes.DB_STATEMENT,
      statement,
      options,
    );

    if (filteredSpans.length < this.times) {
      throw new Error(`Expected ${this.times} queries by ${
        this.serviceName
      } to postgresql with statement ${statement}, but found ${
        filteredSpans.length
      }.\n
      Found statements:\n${printStatements(this.spans)}`);
    }

    return new PostgreSQLQuery(filteredSpans, this.serviceName, this.times);
  }

  withOperations(...operations: string[]) {
    const filteredSpans = this.spans.filter((span) => {
      const statement = span.attributes?.find(
        (attribute: opentelemetry.proto.common.v1.IKeyValue) =>
          attribute.key === SemanticAttributes.DB_STATEMENT,
      )?.value?.stringValue;

      if (!statement) {
        return false;
      }

      const lowerCaseStatement = statement.toLowerCase();

      return operations.every((operation) =>
        lowerCaseStatement.includes(operation.toLowerCase()),
      );
    });

    if (filteredSpans.length < this.times) {
      throw new Error(
        `Expected ${this.times} queries by ${this.serviceName} to postgresql with operations ${operations}, but found ${filteredSpans.length}.\n` +
          `Found statements:\n${printStatements(this.spans)}`,
      );
    }

    return new PostgreSQLQuery(filteredSpans, this.serviceName, this.times);
  }

  withTables(...tables: string[]) {
    const filteredSpans = this.spans.filter((span) => {
      const statement = span.attributes?.find(
        (attribute: opentelemetry.proto.common.v1.IKeyValue) =>
          attribute.key === SemanticAttributes.DB_STATEMENT,
      )?.value?.stringValue;

      if (!statement) {
        return false;
      }

      const matches = statement.match(tablesRegex);
      const cleaned = matches?.map((elem: string) => {
        const [_, second] = elem.split(' ');
        return second
          .replaceAll('"', '')
          .replaceAll('(', '')
          .replaceAll(')', '')
          .replaceAll('\n', '')
          .toLocaleLowerCase();
      });

      return tables.every((table) =>
        cleaned?.includes(table.toLocaleLowerCase()),
      );
    });

    if (filteredSpans.length < this.times) {
      throw new Error(
        `Expected ${this.times} queries by ${this.serviceName} to postgresql with tables ${tables}, but found ${filteredSpans.length}.\n` +
          `Found statements:\n${printStatements(this.spans)}`,
      );
    }

    return new PostgreSQLQuery(filteredSpans, this.serviceName, this.times);
  }
}

const printStatements = (spans: opentelemetry.proto.trace.v1.ISpan[]) => {
  const MAX_LEN = 100;
  return extractAttributeStringValues(spans, SemanticAttributes.DB_STATEMENT)
    .map((statement) => {
      if (statement.length > MAX_LEN) {
        return `${statement.slice(0, MAX_LEN)}...`;
      }
      return statement;
    })
    .join('\n');
};
