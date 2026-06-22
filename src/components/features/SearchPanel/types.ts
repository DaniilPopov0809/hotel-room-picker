import type { SingleParserBuilder } from "nuqs";

export interface SearchParsers {
  checkIn: SingleParserBuilder<string>;
  checkOut: SingleParserBuilder<string>;
  rooms: SingleParserBuilder<number>;
  adults: SingleParserBuilder<number>;
  children: SingleParserBuilder<number[]>;
}
