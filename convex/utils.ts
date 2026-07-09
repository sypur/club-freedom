export function removeUndefinedFromRecord<T extends Record<string, unknown>>(
  record: T,
) {
  return Object.fromEntries(
    Object.entries(record).filter(([_, value]) => value !== undefined),
  ) as Partial<T>;
}

export function getNextScheduleTime(allowedDays: number[], hour: number): Date {
  const now = new Date();

  const target = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hour,
    0,
    0,
    0,
  );

  for (let i = 0; i < 8; i++) {
    const targetDay = target.getDay();

    if (allowedDays.includes(targetDay) && target.getTime() > now.getTime()) {
      return target;
    }

    target.setDate(target.getDate() + 1);
  }

  return target;
}
