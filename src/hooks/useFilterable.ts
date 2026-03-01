// useFilterable Hook - AEVUM Enterprise ERP
// Reusable hook for filtering, searching, and pagination - DRY Principle

import { useState, useMemo, useCallback } from 'react';

export interface FilterConfig {
  key: string;
  label?: string;
  type: 'search' | 'select' | 'multiselect' | 'date' | 'daterange';
  placeholder?: string;
  options?: { value: string; label: string }[];
}

export interface UseFilterableOptions<T> {
  data: T[];
  itemsPerPage?: number;
  defaultFilters?: Record<string, string>;
  searchFields?: string[];
}

export interface UseFilterableReturn<T> {
  // State
  filters: Record<string, string>;
  searchQuery: string;
  currentPage: number;
  itemsPerPage: number;
  
  // Filtered data
  filteredData: T[];
  
  // Pagination
  totalPages: number;
  paginatedData: T[];
  totalItems: number;
  
  // Stats
  showingFrom: number;
  showingTo: number;
  
  // Actions
  setFilter: (key: string, value: string) => void;
  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (count: number) => void;
  resetFilters: () => void;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
}

export function useFilterable<T>({
  data,
  itemsPerPage = 10,
  defaultFilters = {},
  searchFields = [],
}: UseFilterableOptions<T>): UseFilterableReturn<T> {
  const [filters, setFilters] = useState<Record<string, string>>(defaultFilters);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentItemsPerPage, setItemsPerPage] = useState(itemsPerPage);

  // Filter data based on filters and search
  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Search filter
      if (searchQuery && searchFields.length > 0) {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = searchFields.some(field => {
          const value = (item as any)[field];
          if (typeof value === 'string') {
            return value.toLowerCase().includes(searchLower);
          }
          if (typeof value === 'number') {
            return value.toString().includes(searchLower);
          }
          return false;
        });
        if (!matchesSearch) return false;
      }

      // Other filters
      return Object.entries(filters).every(([key, value]) => {
        if (!value || value === 'all') return true;
        const itemValue = (item as any)[key];
        if (Array.isArray(itemValue)) {
          return itemValue.includes(value);
        }
        return itemValue === value;
      });
    });
  }, [data, searchQuery, searchFields, filters]);

  // Pagination
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / currentItemsPerPage);
  
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * currentItemsPerPage;
    return filteredData.slice(startIndex, startIndex + currentItemsPerPage);
  }, [filteredData, currentPage, currentItemsPerPage]);

  const showingFrom = (currentPage - 1) * currentItemsPerPage + 1;
  const showingTo = Math.min(currentPage * currentItemsPerPage, totalItems);

  // Reset page when filters change
  const setFilter = useCallback((key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
    setSearchQuery('');
    setCurrentPage(1);
  }, [defaultFilters]);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }, [totalPages]);

  const nextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  }, []);

  return {
    // State
    filters,
    searchQuery,
    currentPage,
    itemsPerPage: currentItemsPerPage,
    
    // Filtered data
    filteredData,
    
    // Pagination
    totalPages,
    paginatedData,
    totalItems,
    
    // Stats
    showingFrom,
    showingTo,
    
    // Actions
    setFilter,
    setSearchQuery,
    setCurrentPage,
    setItemsPerPage: setItemsPerPage,
    resetFilters,
    goToPage,
    nextPage,
    prevPage,
  };
}

export default useFilterable;

