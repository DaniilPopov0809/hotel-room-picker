"use client";

import type { SearchParsers } from "@/components/features/SearchPanel/types";
import { clampNumber } from "@/components/shared/lib/common";
import { formatDateInput, today, parseDateInput } from "@/components/shared/lib/dates";
import type { SearchParams } from "@/components/shared/types/search";
import { addDays, addMonths, addYears, isBefore, isAfter } from "date-fns";
import { BedDouble, CalendarDays, Users } from "lucide-react";
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryStates,
} from "nuqs";
import { useMemo, useState, useEffect } from "react";
import { Stepper } from "../../shared/ui/Stepper";

interface SearchPanelProps {
  initialSearch: SearchParams;
}

const searchParsers = {
  checkIn: parseAsString,
  checkOut: parseAsString,
  rooms: parseAsInteger,
  adults: parseAsInteger,
  children: parseAsArrayOf(parseAsInteger),
} satisfies SearchParsers;

export function SearchPanel({ initialSearch }: SearchPanelProps) {
  const initialQuery = useMemo(
    () => ({
      checkIn: formatDateInput(initialSearch.checkIn),
      checkOut: formatDateInput(initialSearch.checkOut),
      rooms: initialSearch.rooms,
      adults: initialSearch.adults,
      children: initialSearch.childrenAges,
    }),
    [initialSearch],
  );

  const [query, setQuery] = useQueryStates(searchParsers, {
    history: "push",
    shallow: false,
  });

  const values = {
    checkIn: query.checkIn ?? initialQuery.checkIn,
    checkOut: query.checkOut ?? initialQuery.checkOut,
    rooms: query.rooms ?? initialQuery.rooms,
    adults: query.adults ?? initialQuery.adults,
    children: query.children ?? initialQuery.children,
  };

  const commitQuery = async (nextValues: typeof values): Promise<void> => {
    await setQuery(nextValues);
  };

  // Local string state for input controls to prevent crashes during manual editing
  const [checkInInput, setCheckInInput] = useState(values.checkIn);
  const [checkOutInput, setCheckOutInput] = useState(values.checkOut);

  // Sync inputs with URL changes (e.g. initial load or back/forward navigation)
  useEffect(() => {
    setCheckInInput(values.checkIn);
  }, [values.checkIn]);

  useEffect(() => {
    setCheckOutInput(values.checkOut);
  }, [values.checkOut]);

  // Safe min/max calculations to prevent RangeError crashes
  const parsedLocalCheckIn = parseDateInput(checkInInput);
  const minCheckInStr = formatDateInput(today());
  const maxCheckInStr = formatDateInput(addYears(today(), 1));

  const minCheckOutStr = parsedLocalCheckIn
    ? formatDateInput(addDays(parsedLocalCheckIn, 1))
    : formatDateInput(addDays(today(), 1));

  const maxCheckOutStr = parsedLocalCheckIn
    ? formatDateInput(addMonths(parsedLocalCheckIn, 1))
    : formatDateInput(addMonths(addDays(today(), 1), 1));

  // Client-side validation logic
  const errors = useMemo(() => {
    const errs: { checkIn?: string; checkOut?: string } = {};
    const pCheckIn = parseDateInput(checkInInput);
    const pCheckOut = parseDateInput(checkOutInput);

    if (!checkInInput) {
      errs.checkIn = "Check-in date is required";
    } else if (!pCheckIn) {
      errs.checkIn = "Invalid check-in date";
    } else {
      if (isBefore(pCheckIn, today())) {
        errs.checkIn = "Cannot be in the past";
      } else if (isAfter(pCheckIn, addYears(today(), 1))) {
        errs.checkIn = "Max 1 year in advance";
      }
    }

    if (!checkOutInput) {
      errs.checkOut = "Check-out date is required";
    } else if (!pCheckOut) {
      errs.checkOut = "Invalid check-out date";
    } else if (pCheckIn) {
      if (!isAfter(pCheckOut, pCheckIn)) {
        errs.checkOut = "Must be after check-in";
      } else if (isAfter(pCheckOut, addMonths(pCheckIn, 1))) {
        errs.checkOut = "Stay cannot exceed 1 month";
      }
    }

    return errs;
  }, [checkInInput, checkOutInput]);

  const handleCheckInChange = (newVal: string) => {
    setCheckInInput(newVal);

    const parsedIn = parseDateInput(newVal);
    if (!parsedIn) return; // Keep input local, do not commit.

    let nextCheckOut = checkOutInput;
    const parsedOut = parseDateInput(checkOutInput);

    if (isBefore(parsedIn, today()) || isAfter(parsedIn, addYears(today(), 1))) {
      return;
    }

    if (parsedOut && !isAfter(parsedOut, parsedIn)) {
      const adjustedOut = addDays(parsedIn, 1);
      nextCheckOut = formatDateInput(adjustedOut);
      setCheckOutInput(nextCheckOut);
    }

    const finalParsedOut = parseDateInput(nextCheckOut);
    if (finalParsedOut && isAfter(finalParsedOut, parsedIn) && !isAfter(finalParsedOut, addMonths(parsedIn, 1))) {
      commitQuery({
        ...values,
        checkIn: newVal,
        checkOut: nextCheckOut,
      });
    } else {
      commitQuery({
        ...values,
        checkIn: newVal,
      });
    }
  };

  const handleCheckOutChange = (newVal: string) => {
    setCheckOutInput(newVal);

    const parsedIn = parseDateInput(checkInInput);
    const parsedOut = parseDateInput(newVal);

    if (!parsedIn || !parsedOut) return; // Do not commit invalid dates to URL.

    if (isAfter(parsedOut, parsedIn) && !isAfter(parsedOut, addMonths(parsedIn, 1))) {
      commitQuery({
        ...values,
        checkOut: newVal,
      });
    }
  };

  const updateChildrenCount = async (count: number): Promise<void> => {
    const nextCount = clampNumber(count, 0, 8);
    const current = values.children;
    const nextChildren =
      nextCount > current.length
        ? [...current, ...Array.from({ length: nextCount - current.length }, () => 7)]
        : current.slice(0, nextCount);

    await commitQuery({
      ...values,
      children: nextChildren,
    });
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <div className="grid grid-cols-1 gap-3 items-start lg:grid-cols-[minmax(180px,1fr)_minmax(180px,1fr)_minmax(300px,1fr)]">
        <div className="flex flex-col gap-1">
          <label className={`flex items-center gap-3 rounded-md border px-4 py-1 transition focus-within:ring-2 ${
            errors.checkIn
              ? "border-red-300 focus-within:border-red-500 focus-within:ring-red-100"
              : "border-slate-300 focus-within:border-brand focus-within:ring-focus-soft"
          }`}>
            <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-500">
              <CalendarDays className="size-5" aria-hidden="true" />
            </span>
            <span className="grid flex-1 gap-0.5">
              <span className="text-[11px] font-semibold text-slate-500">Check in</span>
              <input
                className="w-full bg-transparent text-base font-semibold tabular-nums text-slate-950 outline-none"
                max={maxCheckInStr}
                min={minCheckInStr}
                type="date"
                value={checkInInput}
                onChange={(event) => handleCheckInChange(event.target.value)}
              />
            </span>
          </label>
          {errors.checkIn && (
            <span className="px-1 text-xs font-semibold text-red-600">
              {errors.checkIn}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className={`flex items-center gap-3 rounded-md border px-4 py-1 transition focus-within:ring-2 ${
            errors.checkOut
              ? "border-red-300 focus-within:border-red-500 focus-within:ring-red-100"
              : "border-slate-300 focus-within:border-brand focus-within:ring-focus-soft"
          }`}>
            <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-500">
              <CalendarDays className="size-5" aria-hidden="true" />
            </span>
            <span className="grid flex-1 gap-0.5">
              <span className="text-[11px] font-semibold text-slate-500">Check out</span>
              <input
                className="w-full bg-transparent text-base font-semibold tabular-nums text-slate-950 outline-none"
                max={maxCheckOutStr}
                min={minCheckOutStr}
                type="date"
                value={checkOutInput}
                onChange={(event) => handleCheckOutChange(event.target.value)}
              />
            </span>
          </label>
          {errors.checkOut && (
            <span className="px-1 text-xs font-semibold text-red-600">
              {errors.checkOut}
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 rounded-md border border-slate-300 bg-slate-50/80 px-2 py-2 max-[359px]:flex max-[359px]:w-full max-[359px]:flex-col sm:px-3 sm:py-1 self-start min-h-[50px] items-center">
          <Stepper
            icon={<BedDouble className="size-2.5" aria-hidden="true" />}
            label="Rooms"
            max={8}
            min={1}
            value={values.rooms}
            onChange={(rooms) => commitQuery({ ...values, rooms })}
          />
          <Stepper
            icon={<Users className="size-2.5" aria-hidden="true" />}
            label="Adults"
            max={12}
            min={1}
            value={values.adults}
            onChange={(adults) => commitQuery({ ...values, adults })}
          />
          <Stepper
            label="Children"
            max={8}
            min={0}
            value={values.children.length}
            onChange={updateChildrenCount}
          />
        </div>
      </div>

      {values.children.length > 0 ? (
        <div className="mt-3 grid gap-2 border-t border-slate-100 pt-3 sm:grid-cols-4">
          {values.children.map((age, index) => (
            <Stepper
              key={index}
              label={`Child ${index + 1} age`}
              max={17}
              min={0}
              value={age}
              onChange={(nextAge) => {
                const nextChildren = [...values.children];
                nextChildren[index] = nextAge;
                commitQuery({
                  ...values,
                  children: nextChildren,
                });
              }}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
