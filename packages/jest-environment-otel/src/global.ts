import {
  setup as setupServer,
  teardown as teardownServer,
  ERROR_TIMEOUT,
} from 'jest-dev-server';
import chalk from 'chalk';
import { readConfig } from './readConfig';
import type { Config as JestConfig } from 'jest';

let didAlreadyRunInWatchMode = false;

export async function setup(jestConfig: JestConfig = {}) {
  const config = await readConfig();

  // If we are in watch mode, - only setupServer() once.
  if (jestConfig.watch || jestConfig.watchAll) {
    if (didAlreadyRunInWatchMode) return;
    didAlreadyRunInWatchMode = true;
  }

  try {
    await setupServer({
      command: 'node ./node_modules/@traceloop/otel-receiver/dist/index.js',
      // debug: true,
      host: 'localhost',
      port: 4123,
      protocol: 'http',
      path: 'ping',
      usedPortAction: 'kill', // todo: improve this
    });
  } catch (error: any) {
    if (error.code === ERROR_TIMEOUT) {
      console.log('');
      console.error(chalk.red(error.message));
      process.exit(1);
    }
    throw error;
  }
}

export async function teardown(jestConfig: JestConfig = {}) {
  if (!jestConfig.watch && !jestConfig.watchAll) {
    await teardownServer();
  }
}
