// hooks/usePaginatedAlunos.ts
import { useState, useEffect, useCallback } from 'react';

export interface Aluno {
  id: string;
  name: string;
  phone: string;
  createdAt: string;
  paymentStatus: string;
  plan: {
    name: string;
  };
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiResponse {
  success: boolean;
  data: {
    alunos: Aluno[];
    pagination: PaginationInfo;
    query: {
      search: string;
      sortBy: string;
      sortOrder: string;
    };
  };
  error?: string;
}

export interface UsePaginatedAlunosParams {
  initialPage?: number;
  initialLimit?: number;
  initialSearch?: string;
  initialSortBy?: string;
  initialSortOrder?: 'asc' | 'desc';
}

export const usePaginatedAlunos = ({
  initialPage = 1,
  initialLimit = 10,
  initialSearch = '',
  initialSortBy = 'createdAt',
  initialSortOrder = 'desc'
}: UsePaginatedAlunosParams = {}) => {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Query parameters
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [search, setSearch] = useState(initialSearch);
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [sortOrder, setSortOrder] = useState(initialSortOrder);

  const fetchAlunos = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy: sortBy,
        sortOrder: sortOrder
      });

      // Only add search param if there's a search term
      if (search && search.length >= 2) {
        params.append('q', search);
      }

      const response = await fetch(`/api/alunos?${params}`);
      const data: ApiResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch alunos');
      }

      setAlunos(data.data.alunos);
      setPagination(data.data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setAlunos([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, sortBy, sortOrder]);

  useEffect(() => {
    fetchAlunos();
  }, [fetchAlunos]);

  const goToPage = useCallback((newPage: number) => {
    if (pagination && newPage >= 1 && newPage <= pagination.totalPages) {
      setPage(newPage);
    }
  }, [pagination]);

  const nextPage = useCallback(() => {
    if (pagination?.hasNextPage) {
      setPage(prev => prev + 1);
    }
  }, [pagination]);

  const previousPage = useCallback(() => {
    if (pagination?.hasPreviousPage) {
      setPage(prev => prev - 1);
    }
  }, [pagination]);

  const updateSearch = useCallback((newSearch: string) => {
    setSearch(newSearch);
    setPage(1); 
  }, []);

  const updateSort = useCallback((newSortBy: string, newSortOrder?: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    if (newSortOrder) {
      setSortOrder(newSortOrder);
    }
    setPage(1);
  }, []);

  const updateLimit = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1); 
  }, []);

  const refresh = useCallback(() => {
    fetchAlunos();
  }, [fetchAlunos]);

  return {
    // Data
    alunos,
    pagination,
    loading,
    error,
    
    // Current state
    page,
    limit,
    search,
    sortBy,
    sortOrder,
    
    // Actions
    goToPage,
    nextPage,
    previousPage,
    updateSearch,
    updateSort,
    updateLimit,
    refresh,
    
    // Setters for direct control
    setPage,
    setLimit,
    setSearch,
    setSortBy,
    setSortOrder
  };
};