export default function removeUndefinedFromRecord<
  T extends Record<string, unknown>,
>(record: T) {
  return Object.fromEntries(
    Object.entries(record).filter(([_, value]) => value !== undefined),
  ) as Partial<T>;
}
