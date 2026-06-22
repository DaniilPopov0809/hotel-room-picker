import type { PricedRoom } from "@/components/entities/types";

export type BedFilter = "all" | "1" | "2";

export function parseBedFilter(value: string | string[] | undefined): BedFilter {
  const raw = Array.isArray(value) ? value[0] : value;

  if (raw === "1" || raw === "2") {
    return raw;
  }

  return "all";
}

export function filterRoomsByBedFilter(
  rooms: PricedRoom[],
  bedFilter: BedFilter,
): PricedRoom[] {
  if (bedFilter === "all") {
    return rooms;
  }

  const expectedBeds = Number(bedFilter);

  return rooms.filter((room) => {
    const actualBeds = room.bedType.startsWith("2 ") ? 2 : 1;

    return actualBeds === expectedBeds;
  });
}
