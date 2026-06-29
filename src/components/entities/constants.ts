import type { Room, RoomBadge } from "@/components/entities/types";
import { addDays } from "date-fns";

export const ROOM_BADGE_BG: Record<RoomBadge, string> = {
  "good-price": "bg-brand",
  "top-deal": "bg-emerald-600",
}

export const ROOM_BADGE_LABEL: Record<RoomBadge, string> = {
  "good-price": "Good price",
  "top-deal": "Top deal",
}

export const rooms: Room[] = [
  {
    id: "king-suite",
    planId: "king-suite-breakfast-plan",
    name: "King Suite",
    description: "Bright suite with a separate sitting area and balcony view.",
    maxAdults: 2,
    maxChildren: 2,
    sizeSqm: 42,
    bedType: "1 king bed",
    pricePerNight: 171,
    currency: "USD",
    cancellationPolicy: {
      type: "free-cancellation",
      until: addDays(new Date("2026-07-01"), -2),
    },
    mealPlan: "breakfast",
    images: [
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=900&q=80",
    ],
    amenities: ["Free WiFi", "City view", "Air conditioning"],
    badge: 'good-price',
  },
  {
    id: "accessible-king",
    planId: "accessible-king-basic-plan",
    name: "King Suite with Accessible Roll-in Shower",
    description: "Accessible room with generous floor space and calm neutral tones.",
    maxAdults: 3,
    maxChildren: 1,
    sizeSqm: 39,
    bedType: "1 king bed and sofa",
    pricePerNight: 192,
    currency: "USD",
    cancellationPolicy: {
      type: "non-refundable",
    },
    mealPlan: null,
    images: [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80",
    ],
    amenities: ["Roll-in shower", "Workspace", "Free WiFi"],
  },
  {
    id: "two-queen",
    planId: "two-queen-half-board-plan",
    name: "King Bed Accessible Tub",
    description: "Comfortable room with accessible bath and a quiet courtyard side.",
    maxAdults: 2,
    maxChildren: 3,
    sizeSqm: 36,
    bedType: "1 king bed",
    pricePerNight: 171,
    currency: "USD",
    cancellationPolicy: {
      type: "free-cancellation",
      until: addDays(new Date("2026-07-01"), -1),
    },
    mealPlan: "half-board",
    images: [
      "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=900&q=80",
    ],
    amenities: ["Accessible tub", "Mini fridge", "Free WiFi"],
  },
  {
    id: "family-studio",
    planId: "family-studio-full-board-plan",
    name: "Family Studio",
    description: "Open studio for larger families with two sleeping zones.",
    maxAdults: 4,
    maxChildren: 4,
    sizeSqm: 58,
    bedType: "2 queen beds",
    pricePerNight: 236,
    currency: "USD",
    cancellationPolicy: {
      type: "free-cancellation",
      until: addDays(new Date("2026-07-01"), -3),
    },
    mealPlan: "full-board",
    images: [
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=900&q=80",
    ],
    amenities: ["Kitchenette", "Extra beds", "Breakfast table"],
    badge: 'top-deal'
  },
];
