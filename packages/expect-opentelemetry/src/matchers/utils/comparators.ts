import deepEqual from 'deep-equal';
import { expect } from '@jest/globals';
import { CompareOptions, COMPARE_TYPE } from './compare-types';

type MaybeString = string | undefined | null;

export const stringEquals = (a: MaybeString, b: MaybeString): boolean =>
  a === b;

export const stringContains = (a: MaybeString, b: MaybeString): boolean =>
  !!a && !!b && a.includes(b);

export const stringByRegex = (
  a: MaybeString,
  b: RegExp | undefined | null,
): boolean => !!a && !!b && b.test(a);

export const objectEquals = (
  a: Record<string, unknown>,
  b: Record<string, unknown>,
): boolean => deepEqual(a, b);

export const objectContains = (
  a: Record<string, unknown>,
  b: Record<string, unknown>,
): boolean => {
  try {
    expect(a).toMatchObject(b);
    return true;
  } catch (e) {
    return false;
  }
};

export const stringCompare = (
  a: MaybeString,
  b: MaybeString | RegExp,
  options?: CompareOptions,
): boolean => {
  switch (options?.compareType) {
    case COMPARE_TYPE.CONTAINS:
      return stringContains(a, b as string);
    case COMPARE_TYPE.REGEX:
      return stringByRegex(a, b as RegExp);
    default:
      return stringEquals(a, b as string);
  }
};

export const objectCompare = (
  a: Record<string, unknown>,
  b: Record<string, unknown>,
  options?: CompareOptions,
): boolean => {
  switch (options?.compareType) {
    case COMPARE_TYPE.CONTAINS:
      return objectContains(a, b);
    default:
      return objectEquals(a, b);
  }
};
