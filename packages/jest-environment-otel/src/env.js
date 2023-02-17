import NodeEnvironment from 'jest-environment-node';
import { readConfig } from './readConfig';

const handleError = (error) => {
  process.emit('uncaughtException', error);
};

const KEYS = {
  CONTROL_C: '\u0003',
  CONTROL_D: '\u0004',
  ENTER: '\r',
};
// JEST_WORKER_ID starts at 1
const getWorkerIndex = () => process.env.JEST_WORKER_ID - 1;

// const screenshotsDirectory = join(process.cwd(), "screenshots");

class OpenTelemetryEnvironment extends NodeEnvironment {
  // Jest is not available here, so we have to reverse engineer
  // the setTimeout function, see https://github.com/facebook/jest/blob/v23.1.0/packages/jest-runtime/src/index.js#L823
  setTimeout(timeout) {
    if (this.global.jasmine) {
      // eslint-disable-next-line no-underscore-dangle
      this.global.jasmine.DEFAULT_TIMEOUT_INTERVAL = timeout;
    } else {
      this.global[Symbol.for('TEST_TIMEOUT_SYMBOL')] = timeout;
    }
  }

  async setup() {
    const config = await readConfig();
    this.global.openTelemetryConfig = config;

    this.global.jestOpenTelemetry = {};
  }

  async teardown() {}
}

export { OpenTelemetryEnvironment };
