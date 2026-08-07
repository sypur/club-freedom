import { TZDate } from "@date-fns/tz";
import { addDays } from "date-fns";

export function removeUndefinedFromRecord<T extends Record<string, unknown>>(
  record: T,
) {
  return Object.fromEntries(
    Object.entries(record).filter(([_, value]) => value !== undefined),
  ) as Partial<T>;
}

export function getNextScheduleTime(
  allowedDaysOfTheWeek: number[],
  hour: number,
  timezone?: string | null,
): Date {
  const targetTz = timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const now = Date.now();
  const nowInTz = new TZDate(new Date(), targetTz);

  const target = new TZDate(
    nowInTz.getFullYear(),
    nowInTz.getMonth(),
    nowInTz.getDate(),
    hour,
    0,
    0,
    0,
    targetTz,
  );

  for (let i = 0; i < 8; i++) {
    const targetDay = target.getDay();

    if (allowedDaysOfTheWeek.includes(targetDay) && target.getTime() > now) {
      return target;
    }

    target.setDate(target.getDate() + 1);
  }

  return new Date(target.getTime());
}
