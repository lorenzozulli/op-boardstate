export const isPermutation = <T>(candidate: T[], reference: T[]): boolean =>
  candidate.length === reference.length && candidate.every((item) => reference.includes(item));
