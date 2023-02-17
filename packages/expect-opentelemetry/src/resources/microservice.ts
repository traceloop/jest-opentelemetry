import { ReadableSpan } from "@opentelemetry/tracing";

export class Microservice {
  constructor(public readonly name, public readonly spans: ReadableSpan[]) {}
}