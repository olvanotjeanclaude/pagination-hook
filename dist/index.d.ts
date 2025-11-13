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
/**
 * usePagination
 * Generic React hook for paginated, searchable, and filterable data
 */
export declare function usePagination<T extends Record<string, any>>(data: T[], options?: FilterOptions<T>): FilterReturn<T>;
