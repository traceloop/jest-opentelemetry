import {
  toReceiveHttpRequest,
  toSendHttpRequest,
  toQueryPostgreSQL,
  toReceiveGrpcRequest,
  toSendGrpcRequest,
} from './matchers/service';
import { expect } from '@jest/globals';
import {
  GrpcRequest,
  HttpRequest,
  PostgreSQLQuery,
  Service,
} from './resources';
export { setDefaultOptions, getDefaultOptions } from './options';

export * from './matchers';
export * from './resources';
export * from './trace-loop';

const serviceMatchers = {
  toReceiveHttpRequest,
  toSendHttpRequest,
  toQueryPostgreSQL,
  toReceiveGrpcRequest,
  toSendGrpcRequest,
};

interface TraceMatchers {
  toReceiveHttpRequest(): HttpRequest;
  toSendHttpRequest(): HttpRequest;
  toQueryPostgreSQL(): PostgreSQLQuery;
  toReceiveGrpcRequest(): GrpcRequest;
  toSendGrpcRequest(): GrpcRequest;
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
