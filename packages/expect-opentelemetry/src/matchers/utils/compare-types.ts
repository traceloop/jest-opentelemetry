export const COMPARE_TYPE = {
  EQUALS: 'equal',
  CONTAINS: 'contain',
  REGEX: 'regex',
} as const;

export type CompareType = (typeof COMPARE_TYPE)[keyof typeof COMPARE_TYPE];
