import type {
  RawSearchParams,
  SearchParams,
  SearchParseResult,
} from "@/components/shared/types/search";
import { isValidStayRange, parseDateInput, today } from "@/components/shared/lib/dates";
import { rawSearchSchema } from "./schema";

import { addDays } from "date-fns";

export function defaultCheckIn(): Date {
  return addDays(today(), 7);
}

export function defaultCheckOut(): Date {
  return addDays(defaultCheckIn(), 4);
}

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parseChildren(value: string | undefined): number[] {
  if (value === undefined || value.trim() === "") {
    return [];
  }

  return value.split(",").map((age) => Number(age));
}

export function hasSearchParams(params: RawSearchParams): boolean {
  return ["checkIn", "checkOut", "rooms", "adults", "children"].some(
    (key) => firstValue(params[key]) !== undefined,
  );
}

export function parseSearchParams(params: RawSearchParams): SearchParseResult {
  const raw = {
    checkIn: firstValue(params.checkIn),
    checkOut: firstValue(params.checkOut),
    rooms: firstValue(params.rooms),
    adults: firstValue(params.adults),
    childrenAges: parseChildren(firstValue(params.children)),
  };

  const parsed = rawSearchSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      success: false,
      error: "Invalid search parameters",
    };
  }

  const checkIn: Date | null = parseDateInput(parsed.data.checkIn);
  const checkOut: Date | null = parseDateInput(parsed.data.checkOut);

  if (checkIn === null || checkOut === null || !isValidStayRange(checkIn, checkOut)) {
    return {
      success: false,
      error: "Invalid search parameters",
    };
  }

  const data: SearchParams = {
    checkIn,
    checkOut,
    rooms: parsed.data.rooms,
    adults: parsed.data.adults,
    childrenAges: parsed.data.childrenAges,
  };

  return {
    success: true,
    data,
  };
}
