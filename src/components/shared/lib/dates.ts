import {
  addMonths,
  addYears,
  differenceInCalendarDays,
  format,
  isAfter,
  isBefore,
  isValid,
  parse,
  startOfDay,
} from "date-fns";

const DATE_FORMAT = "yyyy-MM-dd";

export function today(): Date {
  return startOfDay(new Date());
}

export function formatDateInput(date: Date): string {
  return format(date, DATE_FORMAT);
}

export function parseDateInput(value: string): Date | null {
  const parsed = parse(value, DATE_FORMAT, new Date());

  if (!isValid(parsed) || format(parsed, DATE_FORMAT) !== value) {
    return null;
  }

  return startOfDay(parsed);
}

export function nightsBetween(checkIn: Date, checkOut: Date): number {
  return differenceInCalendarDays(checkOut, checkIn);
}

export function isValidStayRange(checkIn: Date, checkOut: Date): boolean {
  const minCheckIn = today();
  const maxCheckIn = addYears(minCheckIn, 1);
  const maxCheckOut = addMonths(checkIn, 1);

  return (
    !isBefore(checkIn, minCheckIn) &&
    !isAfter(checkIn, maxCheckIn) &&
    isAfter(checkOut, checkIn) &&
    !isAfter(checkOut, maxCheckOut)
  );
}
