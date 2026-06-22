<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes - APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Overview

Hotel room selection page built with Next.js App Router, TypeScript, and Tailwind CSS.

Single-page application:

- `/` - hotel search and available room list
- `/checkout` - empty page opened after clicking **Reserve** (not implemented)

Search state is stored in the URL so the page can be refreshed or shared while preserving the same search results.

## Example Search URL

```text
/?checkIn=2026-07-01&checkOut=2026-07-05&rooms=2&adults=3&children=5,8
```

Parameters:

- `checkIn` - arrival date
- `checkOut` - departure date
- `rooms` - number of rooms
- `adults` - number of adults
- `children` - comma-separated children ages

---

# Stack

- Next.js 16.2.9 (App Router)
- React 19
- TypeScript (strict mode)
- Tailwind CSS v4
- `nuqs` - URL search params state management
- `date-fns` - date utilities and calculations
- `zod` - URL params validation
- `lucide-react` - icons

---

# Project Structure

```text
src/
|-- app/
|   |-- globals.css
|   |-- layout.tsx
|   |-- page.tsx                  # Server Component
|   `-- checkout/
|       `-- page.tsx              # Empty page, not implemented
|
`-- components/
    |-- entities/
    |   |-- constants.ts          # Mock rooms data
    |   |-- helpers.ts            # Room filtering, checkout URL, formatting helpers
    |   |-- RoomCard.tsx          # Server Component
    |   `-- types.ts              # Room-related types
    |
    |-- features/
    |   |-- RoomList/
    |   |   |-- helpers.ts
    |   |   `-- RoomList.tsx      # Server Component
    |   |
    |   `-- SearchPanel/
    |       |-- helpers.ts        # Search defaults, parsing, validation bridge
    |       |-- schema.ts         # Zod schema for raw URL values
    |       |-- SearchPanel.tsx   # Client Component
    |       `-- types.ts          # SearchPanel-specific types
    |
    `-- shared/
        |-- lib/
        |   |-- common.ts         # Shared generic helpers
        |   `-- dates.ts          # Date helper functions
        |
        |-- types/
        |   |-- common.ts         # CheckoutParams and shared common types
        |   `-- search.ts         # Search-related types
        |
        `-- ui/
            |-- Button.tsx
            `-- Stepper.tsx
```

---

# Architecture Decisions

- `src/app/page.tsx` is a Server Component:
  - awaits `searchParams`
  - checks whether URL search parameters are present
  - validates URL parameters using `parseSearchParams`
  - does not perform room search when validation fails
  - filters available rooms on the server
  - calculates total price for the selected stay

- `SearchPanel` is a Client Component:
  - owns interactive date and guest controls
  - synchronizes values with the URL using `nuqs`
  - receives `initialSearch` from the server
  - uses `Stepper` from `components/shared/ui`

- `RoomList` and `RoomCard` are Server Components:
  - receive prepared data from the server
  - contain no client-side state or effects

- URL is the single source of truth for search state.

- No global state management:
  - no Zustand
  - no Context for search parameters

- Current folder convention:
  - `components/entities` contains room domain data, types, and helpers
  - `components/features` contains feature-level UI such as search and room list
  - `components/shared` contains generic UI, shared types, and shared utilities

---

# Types

## Search Parameters

Defined in `src/components/shared/types/search.ts`.

```ts
interface SearchParams {
  checkIn: Date;
  checkOut: Date;
  rooms: number;
  adults: number;
  childrenAges: number[];
}
```

`RawSearchParams` represents raw Next.js URL values:

```ts
type RawSearchParams = Record<string, string | string[] | undefined>;
```

`SearchParseResult` is a discriminated union:

```ts
type SearchParseResult =
  | {
      success: true;
      data: SearchParams;
    }
  | {
      success: false;
      error: string;
    };
```

## Cancellation Policy

Uses a discriminated union to represent different cancellation types:

```ts
type CancellationPolicy =
  | {
      type: "non-refundable";
    }
  | {
      type: "free-cancellation";
      until: Date;
    };
```

## Meal Plan

```ts
type MealPlan = "breakfast" | "half-board" | "full-board";
```

In `Room`:

```ts
mealPlan: MealPlan | null;
```

- `null` means no meal is included.
- A value means the tariff includes a meal plan.

## Room

Defined in `src/components/entities/types.ts`.

```ts
interface Room {
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
}
```

`PricedRoom` extends `Room` with server-calculated pricing:

```ts
interface PricedRoom extends Room {
  nights: number;
  totalPrice: number;
}
```

Room availability filtering takes into account:

- rooms count
- adults per room
- children per room
- total room capacity

---

# Price Calculation

The UI displays the total price for the selected stay.

Example:

```text
Price per night: $150

5 nights x 2 rooms

Total: $1500
```

The total price is calculated on the server in `findAvailableRooms()`:

```ts
totalPrice: room.pricePerNight * nights * search.rooms
```

---

# Validation Rules

URL parameters are validated with Zod in `src/components/features/SearchPanel/schema.ts` and date range rules in `src/components/shared/lib/dates.ts`.

## Dates

Check-in:

- must be today or later
- maximum 1 year in advance

Check-out:

- must be after check-in
- maximum 1 month after check-in

## Guests

- minimum 1 room
- maximum 8 rooms
- minimum 1 adult
- maximum 12 adults

## Children

- every child must have a valid age between 0 and 17
- maximum 8 children

---

# Invalid Search Handling

Invalid URL parameters must **not** trigger room search.

Example:

```text
/?checkIn=2020-01-01
```

Incorrect behavior:

```text
Invalid date -> replace with today -> show available rooms
```

Correct behavior:

```text
Validation failed -> do not perform search
```

Current behavior:

- when validation fails, `page.tsx` renders `"Invalid search parameters"`
- room search is skipped
- room list is not rendered for the invalid query state

When no search parameters are present:

- the search form receives default dates and guest values
- the room list is empty until a valid search is submitted

---

# Checkout URL

Clicking **Reserve** opens a new browser tab:

```text
/checkout?roomId=king-suite&checkIn=2026-07-01&checkOut=2026-07-05&rooms=2&adults=3&children=5,8
```

`src/components/entities/helpers.ts` is responsible for creating the URL:

```ts
buildCheckoutUrl(params: CheckoutParams): string
```

`CheckoutParams` is defined in `src/components/shared/types/common.ts`.

---

# Code Style

- Functional components only
- Named exports for components, helpers, and types
- Server Components by default
- Add `"use client"` only when interactivity is required
- No `any`
- Use strict TypeScript types
- Distinguish `null` from `undefined`
- Tailwind CSS only
- No CSS Modules
- No inline styles
- Use `date-fns` for all date operations
- Use `lucide-react` for all icons
- Spinner implemented with Tailwind `animate-spin`
- Use inline `<span>` with Tailwind classes instead of a separate Badge component

---

# Responsive Design

The page should work correctly on desktop and mobile.

Desktop layout:

```text
[ Search Panel ]

[ Room Image ] [ Room Details ] [ Price + Reserve ]
```

Mobile layout:

```text
[ Search Panel ]

[ Room Image ]
[ Room Details ]
[ Price ]
[ Reserve Button ]
```

Current room card grid:

```tsx
lg:grid-cols-[300px_1fr_220px]
```

---

# Key Design Decisions

The implementation demonstrates:

- proper Server and Client Component separation
- URL-driven state management
- strong TypeScript modeling
- discriminated unions
- Zod validation
- no hidden fallbacks for invalid URL data
- server-side room filtering and price calculation
- feature/entity/shared component organization
- maintainable component structure
- responsive Tailwind CSS design
