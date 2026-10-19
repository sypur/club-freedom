export function removeUndefinedFromRecord<T extends Record<string, unknown>>(
  record: T,
) {
  return Object.fromEntries(
    Object.entries(record).filter(([_ignore, value]) => value !== undefined),
  ) as Partial<T>;
}
