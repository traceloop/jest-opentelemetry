module.exports = {
  globalSetup: require.resolve('@traceloop/jest-environment-otel/setup'),
  globalTeardown: require.resolve('@traceloop/jest-environment-otel/teardown'),
  testEnvironment: require.resolve('@traceloop/jest-environment-otel'),
  setupFilesAfterEnv: [require.resolve('@traceloop/expect-opentelemetry')],
};
