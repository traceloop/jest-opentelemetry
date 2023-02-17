module.exports = {
  globalSetup: require.resolve('jest-environment-otel/setup'),
  globalTeardown: require.resolve('jest-environment-otel/teardown'),
  // testEnvironment: require.resolve('jest-environment-otel'),
  // setupFilesAfterEnv: [require.resolve('expect-otel')],
};
