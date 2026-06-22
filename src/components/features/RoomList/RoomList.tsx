import { RoomCard } from "@/components/entities/RoomCard";
import type { PricedRoom } from "@/components/entities/types";
import type { SearchParams } from "@/components/shared/types/search";
import { ArrowDown, SlidersHorizontal } from "lucide-react";

interface RoomListProps {
  rooms: PricedRoom[];
  search: SearchParams;
};

export function RoomList({ rooms, search }: RoomListProps) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-start gap-3 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-950">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <ArrowDown className="size-4" aria-hidden="true" />
        </span>
        <div>
          <p className="font-semibold">Price is lower than usual</p>
          <p className="mt-0.5 text-xs text-emerald-800">
            You have great options for your dates.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex h-8 items-center rounded-full border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700">
            All
          </span>
          <span className="inline-flex h-8 items-center rounded-full border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700">
            Refundable
          </span>
          <span className="inline-flex h-8 items-center rounded-full border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700">
            Breakfast
          </span>
        </div>
        <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500">
          <SlidersHorizontal className="size-4" aria-hidden="true" />
          Showing {rooms.length} rooms
        </span>
      </div>

      {rooms.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} search={search} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-10 text-center">
          <h2 className="text-lg font-semibold text-slate-900">No available rooms</h2>
          <p className="mt-2 text-sm text-slate-500">
            Try fewer guests, fewer rooms, or different dates.
          </p>
        </div>
      )}
    </section>
  );
}
