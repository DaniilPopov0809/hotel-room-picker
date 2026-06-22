import type { PricedRoom } from "@/components/entities/types";
import { formatDateInput, nightsBetween } from "@/components/shared/lib/dates";
import type { CheckoutParams } from "@/components/shared/types/common";
import type { SearchParams } from "@/components/shared/types/search";
import { rooms } from "./constants";

export function findAvailableRooms(search: SearchParams): PricedRoom[] {
  const nights = nightsBetween(search.checkIn, search.checkOut);
  const childrenCount = search.childrenAges.length;
  const adultsPerRoom = Math.ceil(search.adults / search.rooms);
  const childrenPerRoom = Math.ceil(childrenCount / search.rooms);

  return rooms
    .filter(
      (room) =>
        room.maxAdults >= adultsPerRoom &&
        room.maxChildren >= childrenPerRoom &&
        room.maxAdults + room.maxChildren >= adultsPerRoom + childrenPerRoom,
    )
    .map((room) => ({
      ...room,
      nights,
      totalPrice: room.pricePerNight * nights * search.rooms,
    }));
}

export function buildCheckoutUrl(params: CheckoutParams): string {
  const searchParams = new URLSearchParams({
    roomId: params.roomId,
    checkIn: formatDateInput(params.checkIn),
    checkOut: formatDateInput(params.checkOut),
    rooms: String(params.rooms),
    adults: String(params.adults),
  });

  if (params.childrenAges.length > 0) {
    searchParams.set("children", params.childrenAges.join(","));
  }

  return `/checkout?${searchParams.toString()}`;
}

export function formatMealPlan(mealPlan: PricedRoom["mealPlan"]): string | null {
  if (mealPlan === null) {
    return null;
  }

  const labels: Record<NonNullable<PricedRoom["mealPlan"]>, string> = {
    breakfast: "Breakfast included",
    "half-board": "Half board included",
    "full-board": "Full board included",
  };

  return labels[mealPlan];
}
