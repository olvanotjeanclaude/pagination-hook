import { useState, useMemo } from "react";

export type FilterValue<T> = T[keyof T] | "ALL" | null;

export type FilterParameters<T> = Partial<Record<keyof T, FilterValue<T>>>;

export interface FilterOptions<T> {
  itemsPerPage?: number;
  searchKeys?: (keyof T)[];
  filters?: FilterParameters<T>;
}

export interface FilterReturn<T> {
  paginatedData: T[];
  filteredData: T[];
  currentPage: number;
  totalPages: number;
  search: string;
  setSearch: (value: string) => void;
  filters: FilterParameters<T>;
  setFilter: <K extends keyof T>(key: K, value: FilterValue<T>) => void;
  setCurrentPage: (page: number) => void;
}

function matchesSearchQuery<T extends Record<string, any>>(
  item: T,
  searchQuery: string,
  keysToSearch: (keyof T)[]
): boolean {
  if (!searchQuery.trim()) return true;

  const lowerQuery = searchQuery.toLowerCase();
  return keysToSearch.some((key) => {
    const value = item[key];
    return value && String(value).toLowerCase().includes(lowerQuery);
  });
}

function matchesAllFilters<T extends Record<string, any>>(
  item: T,
  activeFilters: Partial<Record<keyof T, FilterValue<T>>>
): boolean {
  return (Object.keys(activeFilters) as (keyof T)[]).every((key) => {
    const filterValue = activeFilters[key];
    if (filterValue === "ALL" || filterValue === null) return true;
    return item[key] === filterValue;
  });
}


function getDefaultSearchKeys<T extends Record<string, any>>(item: T): (keyof T)[] {
  return Object.keys(item).filter((key) => typeof item[key as keyof T] === "string") as (keyof T)[];
}

/**
 * usePagination
 * Generic React hook for paginated, searchable, and filterable data
 */
export function usePagination<T extends Record<string, any>>(
  data: T[],
  options: FilterOptions<T> = {}
): FilterReturn<T> {
  const { itemsPerPage = 10, searchKeys, filters = {} } = options;

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState(filters);

  const filteredData = useMemo(() => {
    if (!data.length) return [];
    const keysToSearch = searchKeys || getDefaultSearchKeys(data[0]);
    return data.filter(
      (item) =>
        matchesSearchQuery(item, search, keysToSearch) &&
        matchesAllFilters(item, activeFilters)
    );
  }, [data, search, searchKeys, activeFilters]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleSetFilter = <K extends keyof T>(key: K, value: FilterValue<T>) => {
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  return {
    paginatedData,
    filteredData,
    currentPage,
    totalPages,
    search,
    setSearch: handleSearch,
    filters: activeFilters,
    setFilter: handleSetFilter,
    setCurrentPage,
  };
}
