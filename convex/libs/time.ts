import { tzOffset } from "@date-fns/tz";

function getZonedDateParts(date: Date, timezone: string) {
  const offsetMinutes = tzOffset(timezone, date);
  const shifted = new Date(date.getTime() + offsetMinutes * 60_000);
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth(), // 0-indexed
    day: shifted.getUTCDate(),
    dayOfWeek: shifted.getUTCDay(), // 0 = Sunday
  };
}

function zonedTimeToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  timezone: string,
): Date {
  const approx = new Date(Date.UTC(year, month, day, hour, 0, 0, 0));
  const offsetMinutes = tzOffset(timezone, approx);
  return new Date(approx.getTime() - offsetMinutes * 60_000);
}

/**
 * Finds the earliest instant after `now` that falls on one of `allowedDaysOfTheWeek`
 * at `hour` local time in `timezone`.
 *
 * @param allowedDaysOfTheWeek - 0 (Sunday) through 6 (Saturday)
 * @param hour - 0 through 23
 * @param timezone - IANA timezone string; defaults to 'UTC' if omitted/null
 */
export function getNextScheduleTime(
  allowedDaysOfTheWeek: number[],
  hour: number,
  timezone?: string | null,
): Date {
  if (allowedDaysOfTheWeek.length === 0) {
    throw new Error("allowedDaysOfTheWeek must contain at least one day");
  }

  const tz = timezone ?? "UTC";
  const now = new Date();
  const today = getZonedDateParts(now, tz);

  // Check today, then each of the next 7 days — guarantees we hit every
  // day-of-week at least once even if today's slot has already passed.
  for (let i = 0; i <= 7; i++) {
    const candidateDow = (today.dayOfWeek + i) % 7;
    if (!allowedDaysOfTheWeek.includes(candidateDow)) continue;

    // Roll the calendar date forward by i days (handles month/year rollover).
    const candidateCalendarDate = new Date(
      Date.UTC(today.year, today.month, today.day + i),
    );

    const candidate = zonedTimeToUtc(
      candidateCalendarDate.getUTCFullYear(),
      candidateCalendarDate.getUTCMonth(),
      candidateCalendarDate.getUTCDate(),
      hour,
      tz,
    );

    if (candidate.getTime() > now.getTime()) {
      return candidate;
    }
  }

  // Should be unreachable given the loop covers a full week.
  throw new Error("Could not find a matching schedule time");
}
