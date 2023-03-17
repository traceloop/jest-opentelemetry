# otel-proto

This repository contains both otel proto + traceloop proto files compiled to JS with type definitions

## Compiling proto files:
Compile JS:
    npx pbjs -t static-module -w commonjs -o src/index.js --es6 src/opentelemetry/proto/trace/v1/trace.proto src/opentelemetry/proto/resource/v1/resource.proto src/opentelemetry/proto/common/v1/common.proto src/traceloop/proto/v1/traceloop.proto

Create type definitions:
    npx pbts -o src/index.d.ts src/index.js