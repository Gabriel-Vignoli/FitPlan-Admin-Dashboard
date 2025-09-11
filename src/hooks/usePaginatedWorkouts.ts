import { useState, useEffect, useCallback } from "react";

export interface WorkoutExercise {
  id: string;
  workoutId: string;
  exerciseId: string;
  sets: number;
  reps: string;
  weight?: string;
  rest?: string;
  notes?: string;
  order: number;
  exercise: {
    id: string;
    name: string;
    targetMuscle: string;
    imageUrl: string;
    videoUrl?: string;
  };
}

export interface Workout {
  id: string;
  title: string;
  description: string;
  isFavorite?: boolean;
  exercises: WorkoutExercise[];
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
    workouts: Workout[];
    pagination: PaginationInfo;
    query: {
      search: string;
      sortBy: string;
      sortOrder: string;
    };
  };
  error?: string;
}

export interface UsePaginatedWorkoutsParams {
  initialPage?: number;
  initialLimit?: number;
  initialSearch?: string;
  initialSortBy?: string;
  initialSortOrder?: "asc" | "desc";
}

export const usePaginatedWorkouts = ({
  initialPage = 1,
  initialLimit = 10,
  initialSearch = "",
  initialSortBy = "createdAt",
  initialSortOrder = "desc",
}: UsePaginatedWorkoutsParams = {}) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Query parameters
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [search, setSearch] = useState(initialSearch);
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [sortOrder, setSortOrder] = useState(initialSortOrder);

  const fetchWorkouts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy: sortBy,
        sortOrder: sortOrder,
      });
      if (search && search.length >= 2) {
        params.append("q", search);
      }
      const response = await fetch(`/api/workouts?${params}`);
      const data: ApiResponse = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to fetch workouts");
      }
      setWorkouts(data.data.workouts);
      setPagination(data.data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setWorkouts([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, sortBy, sortOrder]);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  const goToPage = useCallback(
    (newPage: number) => {
      if (pagination && newPage >= 1 && newPage <= pagination.totalPages) {
        setPage(newPage);
      }
    },
    [pagination],
  );

  const nextPage = useCallback(() => {
    if (pagination?.hasNextPage) {
      setPage((prev) => prev + 1);
    }
  }, [pagination]);

  const previousPage = useCallback(() => {
    if (pagination?.hasPreviousPage) {
      setPage((prev) => prev - 1);
    }
  }, [pagination]);

  const updateSearch = useCallback((newSearch: string) => {
    setSearch(newSearch);
    setPage(1);
  }, []);

  const updateSort = useCallback(
    (newSortBy: string, newSortOrder?: "asc" | "desc") => {
      setSortBy(newSortBy);
      if (newSortOrder) {
        setSortOrder(newSortOrder);
      }
      setPage(1);
    },
    [],
  );

  const updateLimit = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  }, []);

  const refresh = useCallback(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  return {
    workouts,
    pagination,
    loading,
    error,
    page,
    limit,
    search,
    sortBy,
    sortOrder,
    goToPage,
    nextPage,
    previousPage,
    updateSearch,
    updateSort,
    updateLimit,
    refresh,
    setPage,
    setLimit,
    setSearch,
    setSortBy,
    setSortOrder,
  };
};
