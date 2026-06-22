"use client";

import { useQueryState } from "nuqs";

const filterItems = [
  { label: "All", value: "all" },
  { label: "1 bed", value: "1" },
  { label: "2 beds", value: "2" },
] as const;

export function RoomFilters() {
  const [bedFilter, setBedFilter] = useQueryState("bed", {
    history: "push",
    shallow: false,
    defaultValue: "all",
  });

  return (
    <div className="flex flex-wrap gap-2">
      {filterItems.map((item) => {
        const active = bedFilter === item.value;

        return (
          <button
            key={item.value}
            aria-pressed={active}
            className={`inline-flex h-8 items-center rounded-full border px-3 text-xs font-semibold transition ${
              active
                ? "border-brand bg-brand text-white"
                : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
            }`}
            type="button"
            onClick={() => setBedFilter(item.value)}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
