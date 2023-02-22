export const COMPARE_TYPE = {
  EQUALS: 'equals',
  CONTAINS: 'contains',
  REGEX: 'regex',
} as const;

export type CompareType = (typeof COMPARE_TYPE)[keyof typeof COMPARE_TYPE];

export type CompareOptions = { compareType: CompareType };
