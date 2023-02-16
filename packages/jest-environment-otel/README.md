# jest-environment-otel

[![Build Status][build-badge]][build]
[![version][version-badge]][package]
[![MIT License][license-badge]][license]

Run your tests using Jest & OpenTelemetry 🎪✨

```
npm install jest-environment-otel
```

## Usage

Update your Jest configuration:

```json
{
  "globalSetup": "jest-environment-otel/setup",
  "globalTeardown": "jest-environment-otel/teardown",
  "testEnvironment": "jest-environment-otel"
}
```

## License

Apache-2.0
