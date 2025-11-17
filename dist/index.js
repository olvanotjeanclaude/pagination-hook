import { useState, useMemo } from "react";
function matchesSearchQuery(item, searchQuery, keysToSearch) {
    if (!searchQuery.trim())
        return true;
    const lowerQuery = searchQuery.toLowerCase();
    return keysToSearch.some((key) => {
        const value = item[key];
        return value && String(value).toLowerCase().includes(lowerQuery);
    });
}
function matchesAllFilters(item, activeFilters) {
    return Object.keys(activeFilters).every((key) => {
        const filterValue = activeFilters[key];
        if (filterValue === "ALL" || filterValue === null)
            return true;
        return item[key] == filterValue;
    });
}
function getDefaultSearchKeys(item) {
    return Object.keys(item).filter((key) => typeof item[key] == "string");
}
/**
 * usePagination
 * Generic React hook for paginated, searchable, and filterable data
 */
export function usePagination(data, options = {}) {
    const { itemsPerPage = 10, searchKeys, filters = {} } = options;
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [activeFilters, setActiveFilters] = useState(filters);
    const filteredData = useMemo(() => {
        if (!data.length)
            return [];
        const keysToSearch = searchKeys || getDefaultSearchKeys(data[0]);
        return data.filter((item) => matchesSearchQuery(item, search, keysToSearch) &&
            matchesAllFilters(item, activeFilters));
    }, [data, search, searchKeys, activeFilters]);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredData.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredData, currentPage, itemsPerPage]);
    const handleSearch = (value) => {
        setSearch(value);
        setCurrentPage(1);
    };
    const handleSetFilter = (key, value) => {
        setActiveFilters((prev) => (Object.assign(Object.assign({}, prev), { [key]: value })));
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
