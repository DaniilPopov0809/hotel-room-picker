import type { SearchParams } from "@/components/shared/types/search";

export interface CheckoutParams extends SearchParams {
  roomId: string;
};
