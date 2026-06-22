import { PricedRoom } from "@/components/entities/types";
import { findAvailableRooms } from "@/components/entities/helpers";
import { RoomList } from "@/components/features/RoomList/RoomList";
import { defaultCheckIn, defaultCheckOut, hasSearchParams, parseSearchParams } from "@/components/features/SearchPanel/helpers";
import { SearchPanel } from "@/components/features/SearchPanel/SearchPanel";
import type { SearchParams, SearchParseResult } from "@/components/shared/types/search";

interface HomeProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Home({ searchParams }: HomeProps) {
  const rawSearchParams: Record<string, string | string[] | undefined> = await searchParams;
  const hasQuery: boolean = hasSearchParams(rawSearchParams);
  const parsedSearch: SearchParseResult | null = hasQuery ? parseSearchParams(rawSearchParams) : null;
  const initialSearch: SearchParams =
    parsedSearch?.success === true
      ? parsedSearch.data
      : {
        checkIn: defaultCheckIn(),
        checkOut: defaultCheckOut(),
        rooms: 1,
        adults: 2,
        childrenAges: [],
      };

  const rooms: PricedRoom[] = parsedSearch?.success === true ? findAvailableRooms(parsedSearch.data) : [];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-1">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
          Hotel deals
        </p>
        <h1 className="text-2xl font-semibold tracking-normal text-slate-950">
          Choose your room
        </h1>
      </header>

      <SearchPanel initialSearch={initialSearch} />

      {parsedSearch?.success === false ? (
        <section className="rounded-lg border border-red-200 bg-red-50 px-4 py-5 text-sm font-medium text-red-700">
          {parsedSearch.error}
        </section>
      ) : (
        <RoomList rooms={rooms} search={initialSearch} />
      )}
    </div>
  );
}
