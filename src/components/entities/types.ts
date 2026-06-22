export type CancellationPolicy =
  | {
      type: "non-refundable";
    }
  | {
      type: "free-cancellation";
      until: Date;
    };

export type MealPlan = "breakfast" | "half-board" | "full-board";

export interface Room {
  id: string;
  name: string;
  description?: string;
  maxAdults: number;
  maxChildren: number;
  sizeSqm: number;
  bedType: string;
  pricePerNight: number;
  currency: "USD";
  cancellationPolicy: CancellationPolicy;
  mealPlan: MealPlan | null;
  images: string[];
  amenities: string[];
};

export interface PricedRoom extends Room {
  nights: number;
  totalPrice: number;
};

