/* eslint-disable no-console */
import {
  setup as setupServer,
  teardown as teardownServer,
  ERROR_TIMEOUT,
  ERROR_NO_COMMAND,
} from 'jest-dev-server';
import chalk from 'chalk';
import { readConfig } from './readConfig';

let didAlreadyRunInWatchMode = false;

export async function setup(jestConfig = {}) {
  const config = await readConfig();

  // If we are in watch mode, - only setupServer() once.
  if (jestConfig.watch || jestConfig.watchAll) {
    if (didAlreadyRunInWatchMode) return;
    didAlreadyRunInWatchMode = true;
  }

  if (config.server) {
    try {
      await setupServer(config.server);
    } catch (error) {
      if (error.code === ERROR_TIMEOUT) {
        console.log('');
        console.error(chalk.red(error.message));
        console.error(
          chalk.blue(
            `\n☝️ You can set "server.launchTimeout" in jest-opentelemetry.config.js`,
          ),
        );
        process.exit(1);
      }
      if (error.code === ERROR_NO_COMMAND) {
        console.log('');
        console.error(chalk.red(error.message));
        console.error(
          chalk.blue(
            `\n☝️ You must set "server.command" in jest-opentelemetry.config.js`,
          ),
        );
        process.exit(1);
      }
      throw error;
    }
  }
}

export async function teardown(jestConfig = {}) {
  const config = await readConfig();

  if (!jestConfig.watch && !jestConfig.watchAll) {
    await teardownServer();
  }
}
