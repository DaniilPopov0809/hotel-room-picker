import { buildCheckoutUrl, formatMealPlan } from "@/components/entities/helpers";
import type { PricedRoom } from "@/components/entities/types";
import type { SearchParams } from "@/components/shared/types/search";
import { format, subDays } from "date-fns";
import { Bath, BedDouble, Coffee, Maximize2, ShieldCheck, Users, Wifi } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ROOM_BADGE_BG, ROOM_BADGE_LABEL } from "./constants";

type RoomCardProps = {
  room: PricedRoom;
  search: SearchParams;
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  currency: "USD",
  maximumFractionDigits: 0,
  style: "currency",
});



export function RoomCard({ room, search }: RoomCardProps) {
  const checkoutUrl: string = buildCheckoutUrl({ ...search, roomId: room.id });
  const mealPlan: string | null = formatMealPlan(room.mealPlan);
  const freeCancellationUntil: Date = subDays(search.checkIn, 3);

  return (
    <article className="grid overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm lg:grid-cols-[300px_1fr_220px]">
      <div className="relative min-h-56 bg-slate-200 lg:min-h-full">
        <Image
          alt={room.name}
          className="absolute inset-0 h-full w-full object-cover"
          fill
          sizes="(min-width: 1024px) 300px, 100vw"
          src={room.images[0]}
        />
        {room.badge && <span className={`absolute left-3 top-3 rounded-md px-2.5 py-1 text-xs font-semibold text-white ${ROOM_BADGE_BG[room.badge]}`}>
          {ROOM_BADGE_LABEL[room.badge]}
        </span>}
      </div>

      <div className="flex flex-col gap-3 p-4">
        <div>
          <h2 className="text-base font-semibold text-slate-950">{room.name}</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">{room.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-700 sm:grid-cols-3">
          <span className="inline-flex items-center gap-1.5">
            <Maximize2 className="size-4 text-slate-500" aria-hidden="true" />
            {room.sizeSqm} sq m
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users className="size-4 text-slate-500" aria-hidden="true" />
            Sleeps {room.maxAdults + room.maxChildren}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <BedDouble className="size-4 text-slate-500" aria-hidden="true" />
            {room.bedType}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Wifi className="size-4 text-slate-500" aria-hidden="true" />
            Free WiFi
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Bath className="size-4 text-slate-500" aria-hidden="true" />
            Private bath
          </span>
        </div>

        <div className="flex flex-col gap-1 text-xs">
          {room.cancellationPolicy.type === "free-cancellation" ? (
            <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700">
              <ShieldCheck className="size-4" aria-hidden="true" />
              Fully refundable before{" "}
              {format(freeCancellationUntil, "MMM d, h:mm a")}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 font-semibold text-slate-700">
              <ShieldCheck className="size-4" aria-hidden="true" />
              Non-refundable
            </span>
          )}
          {mealPlan !== null ? (
            <span className="inline-flex items-center gap-1.5 font-semibold text-slate-900">
              <Coffee className="size-4" aria-hidden="true" />
              {mealPlan}
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col justify-end border-t border-slate-200 p-4 lg:border-l lg:border-t-0">
        <div className="mb-3 flex items-end justify-between gap-3 lg:block">
          <span className="inline-flex rounded-md bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-700">
            10% off
          </span>
          <div className="text-right lg:mt-3">
            <p className="text-xs text-slate-500">
              {room.nights} nights x {search.rooms} room{search.rooms > 1 ? "s" : ""}
            </p>
            <p className="text-2xl font-bold text-slate-950">
              {currencyFormatter.format(room.totalPrice)}
            </p>
            <p className="text-xs text-slate-500">includes taxes and fees</p>
          </div>
        </div>
        <Link
          className="inline-flex h-10 w-full items-center justify-center rounded-md bg-brand px-4 text-sm font-semibold text-white transition hover:bg-brand-hover"
          href={checkoutUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          Reserve
        </Link>
      </div>
    </article>
  );
}
