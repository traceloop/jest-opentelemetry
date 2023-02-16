module.exports = {
  preset: "<rootDir>/../jest-opentelemetry",
  transform: {
    "^.+\\.(t|j)sx?$": ["@swc/jest"],
  },
};
