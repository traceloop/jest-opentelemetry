import { toReceiveHttpRequest } from './matchers/service/to-receive-http-request';
import { toSendHttpRequest } from './matchers/service/to-send-http-request';
import { expect } from '@jest/globals';
import { HttpRequest, Service } from './resources';
export { setDefaultOptions, getDefaultOptions } from './options';

export * from './matchers';
export * from './resources';
export * from './trace-loop';

const serviceMatchers = {
  toReceiveHttpRequest,
  toSendHttpRequest,
};

interface TraceMatchers {
  toReceiveHttpRequest(): HttpRequest;
  toSendHttpRequest(): HttpRequest;
}

function createMatcher(matcher, type) {
  return function throwingMatcher(...args) {
    if (typeof expect !== 'undefined') {
      expect.getState().assertionCalls += 1;
    }

    try {
      return matcher(type, ...args);
    } catch (error: any) {
      Error.captureStackTrace(error, throwingMatcher);
      throw error;
    }
  };
}

export function expectTrace(actual: Service): TraceMatchers {
  const expectation: Partial<TraceMatchers> = {};
  Object.keys(serviceMatchers).forEach((key) => {
    if (key === 'not') return;
    expectation[key] = createMatcher(serviceMatchers[key], actual);
  });

  return expectation as TraceMatchers;
}
