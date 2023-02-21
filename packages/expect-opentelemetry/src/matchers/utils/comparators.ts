import deepEqual from 'deep-equal';

export const stringEquals = (a: string, b: string): boolean => a === b;

export const stringContains = (a: string, b: string): boolean => a.includes(b);

export const stringByRegex = (a: string, b: RegExp): boolean => b.test(a);

export const bodyEquals = (
  a: Record<string, unknown>,
  b: Record<string, unknown>,
): boolean => deepEqual(a, b);

export const bodyContains = (
  a: Record<string, unknown>,
  b: Record<string, unknown>,
): boolean => {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);

  return bKeys.every((key) => aKeys.includes(key) && deepEqual(a[key], b[key]));
};
