"use client";

import type { SearchParsers } from "@/components/features/SearchPanel/types";
import { clampNumber } from "@/components/shared/lib/common";
import { formatDateInput, today } from "@/components/shared/lib/dates";
import type { SearchParams } from "@/components/shared/types/search";
import { addDays, addMonths, addYears } from "date-fns";
import { BedDouble, CalendarDays, Search, Users } from "lucide-react";
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryStates,
} from "nuqs";
import { useMemo } from "react";
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

  const minCheckIn: string = formatDateInput(today());
  const maxCheckIn: string = formatDateInput(addYears(today(), 1));
  const minCheckOut: string = values.checkIn;
  const maxCheckOut: string = formatDateInput(addMonths(new Date(values.checkIn), 1));

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
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-[minmax(180px,1fr)_minmax(180px,1fr)_minmax(300px,1fr)_auto]">
        <label className="flex items-center gap-3 rounded-md border border-slate-300 bg-white px-4 py-1 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-focus-soft">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-500">
            <CalendarDays className="size-5" aria-hidden="true" />
          </span>
          <span className="grid flex-1 gap-0.5">
            <span className="text-[11px] font-semibold text-slate-500">Check in</span>
            <input
              className="w-full bg-transparent text-base font-semibold tabular-nums text-slate-950 outline-none"
              max={maxCheckIn}
              min={minCheckIn}
              type="date"
              value={values.checkIn}
              onChange={(event) =>
                commitQuery({
                  ...values,
                  checkIn: event.target.value,
                  checkOut:
                    event.target.value >= values.checkOut
                      ? formatDateInput(addDays(new Date(event.target.value), 1))
                      : values.checkOut,
                })
              }
            />
          </span>
        </label>

        <label className="flex items-center gap-3 rounded-md border border-slate-300 bg-white px-4 py-1 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-focus-soft">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-500">
            <CalendarDays className="size-5" aria-hidden="true" />
          </span>
          <span className="grid flex-1 gap-0.5">
            <span className="text-[11px] font-semibold text-slate-500">Check out</span>
            <input
              className="w-full bg-transparent text-base font-semibold tabular-nums text-slate-950 outline-none"
              max={maxCheckOut}
              min={minCheckOut}
              type="date"
              value={values.checkOut}
              onChange={(event) =>
                commitQuery({
                  ...values,
                  checkOut: event.target.value,
                })
              }
            />
          </span>
        </label>

        <div className="grid grid-cols-3 gap-2 rounded-md border border-slate-300 bg-slate-50/80 px-3 py-1">
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

        <button
          className="inline-flex h-12 w-full items-center justify-center gap-2 self-center rounded-md bg-brand px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 lg:h-11 lg:min-w-32 lg:w-auto"
          type="button"
          onClick={() => commitQuery(values)}
        >
          <Search className="size-4" aria-hidden="true" />
          Search
        </button>
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
