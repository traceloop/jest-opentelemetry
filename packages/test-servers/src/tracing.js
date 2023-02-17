// tracing.js

'use strict';

const process = require('process');
const opentelemetry = require('@opentelemetry/sdk-node');
const {
  getNodeAutoInstrumentations,
} = require('@opentelemetry/auto-instrumentations-node');
const { Resource } = require('@opentelemetry/resources');
const {
  SemanticResourceAttributes,
} = require('@opentelemetry/semantic-conventions');
const { httpInstrumentationConfig } = require('./otel-custom/http');
const { expressInstrumentationConfig } = require('./otel-custom/express');
const {
  OTLPTraceExporter,
} = require('@opentelemetry/exporter-trace-otlp-http');
const { ConsoleSpanExporter } = require('@opentelemetry/sdk-trace-base');

// Console exporter
// const traceExporter = new ConsoleSpanExporter(); // uncomment to use console HTTP exporter

// OTEL HTTP exporter
const traceExporter = new OTLPTraceExporter({
  url: 'http://localhost:4123/v1/traces',
  timeoutMillis: 100,
}); // uncomment to use OTEL HTTP exporter

const sdk = new opentelemetry.NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'test-servers',
  }),
  traceExporter,
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-http': httpInstrumentationConfig,
      '@opentelemetry/instrumentation-express': expressInstrumentationConfig,
    }),
  ],
});

// initialize the SDK and register with the OpenTelemetry API
// this enables the API to record telemetry
sdk.start();

// gracefully shut down the SDK on process exit
process.on('SIGTERM', () => {
  sdk
    .shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((error) => console.log('Error terminating tracing', error))
    .finally(() => process.exit(0));
});
