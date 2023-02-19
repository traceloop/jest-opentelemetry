import opentelemetry from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { httpInstrumentationConfig } from './otel-custom/http';
import { expressInstrumentationConfig } from './otel-custom/express';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';

const traceExporter = new OTLPTraceExporter({
  url: 'http://localhost:4123/v1/traces',
  timeoutMillis: 100,
});

let serviceName = 'test-servers';
if (process.env.ORDERS_SERVICE) {
  serviceName = 'orders-service';
}
if (process.env.EMAILS_SERVICE) {
  serviceName = 'emails-service';
}

const sdk = new opentelemetry.NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
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
