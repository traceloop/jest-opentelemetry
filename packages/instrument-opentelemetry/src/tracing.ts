import opentelemetry from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { httpInstrumentationConfig } from './otel-custom/http';
import { expressInstrumentationConfig } from './otel-custom/express';
import { OTLPTraceExporter as ProtoExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { OTLPTraceExporter as GRPCExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { containerDetector } from '@opentelemetry/resource-detector-container';

if (process.env.OTEL_EXPORTER_OTLP_ENDPOINT) {
  const traceExporter =
    process.env.OTEL_EXPORTER_TYPE === 'PROTO'
      ? new ProtoExporter({
          url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
          timeoutMillis: 100,
        })
      : new GRPCExporter({
          url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
          timeoutMillis: 100,
        });

  const sdk = new opentelemetry.NodeSDK({
    resource: new Resource(
      process.env.SERVICE_NAME
        ? {
            [SemanticResourceAttributes.SERVICE_NAME]: process.env.SERVICE_NAME,
          }
        : {},
    ),
    traceExporter,
    instrumentations: [
      getNodeAutoInstrumentations({
        '@opentelemetry/instrumentation-http': httpInstrumentationConfig,
        '@opentelemetry/instrumentation-express': expressInstrumentationConfig,
        '@opentelemetry/instrumentation-pg': {
          enhancedDatabaseReporting: true,
        },
      }),
    ],
    resourceDetectors: [containerDetector],
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
}
