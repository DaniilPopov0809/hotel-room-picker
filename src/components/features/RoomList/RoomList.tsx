import { RoomCard } from "@/components/entities/RoomCard";
import type { PricedRoom } from "@/components/entities/types";
import type { SearchParams } from "@/components/shared/types/search";
import { SlidersHorizontal } from "lucide-react";
import { RoomFilters } from "./RoomFilters";

interface RoomListProps {
  rooms: PricedRoom[];
  search: SearchParams;
};

export function RoomList({ rooms, search }: RoomListProps) {
  return (
    <section className="flex flex-col gap-4">

      <div className="flex flex-wrap items-center justify-between gap-3">
        <RoomFilters />
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
