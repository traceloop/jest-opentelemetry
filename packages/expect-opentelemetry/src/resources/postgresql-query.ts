import { SemanticAttributes } from '@opentelemetry/semantic-conventions';
import { opentelemetry } from '@traceloop/otel-proto';
import { Parser } from 'node-sql-parser';
import {
  CompareOptions,
  filterByAttributeStringValue,
} from '../matchers/utils';

export class PostgreSQLQuery {
  constructor(
    readonly spans: opentelemetry.proto.trace.v1.ISpan[],
    private readonly serviceName: string,
    private parser = new Parser(),
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

      const allTablesInStatement = this.parser
        .tableList(prepareQuery(statement), { database: 'PostgresQL' })
        .map((table) => table.split('::')[2].trim());

      return tables.every((table) =>
        allTablesInStatement.includes(table.toLowerCase()),
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

const prepareQuery = (
  query: string, // remove double quotes and replace %s with 111
) => query.replace(/"/g, '').replace(/%s/g, '111').toLocaleLowerCase();
