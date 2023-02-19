import { teardown, setup } from './lib/global';
import { OpenTelemetryEnvironment } from './lib/env';

module.exports = OpenTelemetryEnvironment;
module.exports.setup = setup;
module.exports.teardown = teardown;
