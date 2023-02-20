import { getInstanceType } from './utils';
import { toReceiveHttpRequest } from './matchers/service/to-receive-http-request';
import { toSendHttpRequest } from './matchers/service/to-send-http-request';

export { setDefaultOptions, getDefaultOptions } from './options';

const spanMatchers = {
  not: {},
};

const serviceMatchers = {
  toReceiveHttpRequest,
  toSendHttpRequest,
  not: {},
};

function createMatcher(matcher: any, type: any) {
  return async function throwingMatcher(...args: any[]) {
    if (typeof global.expect !== 'undefined') {
      global.expect.getState().assertionCalls += 1;
    }

    try {
      return await matcher(type, ...args);
    } catch (error: any) {
      Error.captureStackTrace(error, throwingMatcher);
      throw error;
    }
  };
}

function internalExpect(type: any, matchers: any[]) {
  const expectation = {
    not: {},
  };

  matchers &&
    Object.keys(matchers).forEach((key) => {
      if (key === 'not') return;
      expectation[key] = createMatcher(matchers[key], type);
    });

  matchers?.not &&
    Object.keys(matchers.not).forEach((key) => {
      expectation.not[key] = createMatcher(matchers.not[key], type);
    });

  return expectation;
}

function expectOpenTelemetry(actual: any) {
  const type = getInstanceType(actual);
  switch (type) {
    case 'Span':
      return internalExpect(actual, spanMatchers);
    case 'Service':
      return internalExpect(actual, serviceMatchers);
    default:
      throw new Error(`${actual} is not supported`);
  }
}

if (typeof global.expect !== 'undefined') {
  const originalExpect = global.expect;
  global.expect = (actual: any, ...args: any[]) => {
    const type = getInstanceType(actual);

    if (type) {
      const matchers = expectOpenTelemetry(actual);
      const jestMatchers = originalExpect(actual, ...args);
      return {
        ...jestMatchers,
        ...matchers,
        not: {
          ...jestMatchers.not,
          ...matchers.not,
        },
      };
    }
    return originalExpect(actual, ...args);
  };
  Object.keys(originalExpect).forEach((prop) => {
    global.expect[prop] = originalExpect[prop];
  });
}
