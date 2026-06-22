export type RawSearchParams = Record<string, string | string[] | undefined>;

export interface SearchParams {
  checkIn: Date;
  checkOut: Date;
  rooms: number;
  adults: number;
  childrenAges: number[];
}

export type SearchParseResult =
  | {
      success: true;
      data: SearchParams;
    }
  | {
      success: false;
      error: string;
    };
