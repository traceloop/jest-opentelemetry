# jest-environment-otel

Run your tests using Jest & OpenTelemetry 🎪✨

```
npm install @traceloop/jest-environment-otel
```

## Usage

Update your Jest configuration:

```json
{
  "globalSetup": "@traceloop/jest-environment-otel/setup",
  "globalTeardown": "@traceloop/jest-environment-otel/teardown",
  "testEnvironment": "@traceloop/jest-environment-otel"
}
```

## License

Apache-2.0
