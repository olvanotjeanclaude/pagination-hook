# Pagination Hook

A **TypeScript React hook** for **paginated, searchable, and filterable data**.  
Fully typed, generic, and reusable for any array of objects.

---

## Features

- Pagination with customizable items per page
- Search across selected object keys
- Filtering by any object key
- TypeScript support
- Simple and reusable in any React project

---

## Installation

```bash
npm install react-paginate-filter
# or
yarn add react-paginate-filter
```

---

## Usage Example

```tsx
import React from "react";
import { usePagination, FilterValue } from "react-paginate-filter";

interface User {
  name: string;
  role: string;
  age: number;
}

const users: User[] = [
  { name: "Alice", role: "Admin", age: 25 },
  { name: "Bob", role: "User", age: 30 },
  { name: "Charlie", role: "Admin", age: 28 },
];

export function UserTable() {
  const {
    paginatedData,
    search,
    setSearch,
    setFilter,
    currentPage,
    totalPages,
    setCurrentPage,
  } = usePagination(users, {
    itemsPerPage: 2,
    searchKeys: ["name", "role"],
  });

  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <button onClick={() => setFilter("role", "Admin" as FilterValue<User>)}>
        Show Admins
      </button>
      <button onClick={() => setFilter("role", "ALL")}>
        Show All
      </button>

      <ul>
        {paginatedData.map((user) => (
          <li key={user.name}>
            {user.name} — {user.role} — {user.age} years
          </li>
        ))}
      </ul>

      <div>
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Prev
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
```

---

## API Reference

### `usePagination<T>(data, options)`

A generic hook for managing paginated, filtered, and searchable data.

#### Parameters

- **`data`** — Array of objects to paginate
- **`options`** — Configuration object (optional)
  - `itemsPerPage` — Number of items per page (default: `10`)
  - `searchKeys` — Array of object keys to search across (default: all string keys)
  - `filters` — Initial filter values (default: `{}`)

#### Returns

An object containing:

- **`paginatedData`** — Current page of filtered data
- **`filteredData`** — All filtered data (across all pages)
- **`currentPage`** — Current page number
- **`totalPages`** — Total number of pages
- **`search`** — Current search query
- **`setSearch`** — Function to update search query and reset to page 1
- **`filters`** — Current active filters
- **`setFilter`** — Function to set filter values and reset to page 1
- **`setCurrentPage`** — Function to jump to a specific page

---

## Type Definitions

```typescript
type FilterValue<T> = T[keyof T] | "ALL" | null;

interface UsePaginatedFilterOptions<T> {
  itemsPerPage?: number;
  searchKeys?: (keyof T)[];
  filters?: Partial<Record<keyof T, FilterValue<T>>>;
}

interface UsePaginatedFilterReturn<T> {
  paginatedData: T[];
  filteredData: T[];
  currentPage: number;
  totalPages: number;
  search: string;
  setSearch: (value: string) => void;
  filters: Partial<Record<keyof T, FilterValue<T>>>;
  setFilter: <K extends keyof T>(key: K, value: FilterValue<T>) => void;
  setCurrentPage: (page: number) => void;
}
```

---

## How It Works

The hook follows a simple data flow:

1. **Initialize** — Set default options and state
2. **Filter Search** — Match items against search query across specified keys
3. **Apply Filters** — Exclude items that don't match active filters
4. **Calculate Pages** — Determine total pages based on filtered data
5. **Paginate** — Slice data to current page range
6. **Return** — Provide all needed state and handlers to component

When search or filters change, pagination resets to page 1 automatically.

---

## Examples

### Filter by Role

```tsx
setFilter("role", "Admin");
setFilter("role", "ALL"); // Clear filter
```

### Search Specific Keys

```tsx
usePagination(data, {
  searchKeys: ["name", "email"], // Only search these fields
});
```

### Custom Items Per Page

```tsx
usePagination(data, {
  itemsPerPage: 25,
});
```

### Combining Search and Filters

Search and filters work together. An item appears in results only if it matches **both** the search query AND all active filters.

```tsx
const { paginatedData } = usePagination(users, {
  searchKeys: ["name"],
  filters: { role: "Admin" }, // Start with Admin filter
});

// Then apply search
setSearch("alice"); // Only admins named alice will appear
```

---

## License

MIT