"use client";

import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

interface Exercise {
  id: string;
  name: string;
  targetMuscle: string;
  imageUrl: string;
  videoUrl?: string;
}

interface WorkoutExercise {
  id: string;
  workoutId: string;
  exerciseId: string;
  sets: number;
  reps: string;
  weight?: string;
  rest?: string;
  notes?: string;
  order: number;
  exercise: Exercise;
}

interface Workout {
  id: string;
  title: string;
  description: string;
  isFavorite: boolean;
  exercises: WorkoutExercise[];
}

interface WorkoutSearchProps {
  onWorkoutSelect?: (workout: Workout) => void;
  onSearchResults?: (workouts: Workout[]) => void;
  onChange?: (query: string) => void;
  placeholder?: string;
}

export default function WorkoutSearch({
  onSearchResults,
  onChange,
  placeholder = "Buscar treino por nome...",
}: WorkoutSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.length >= 2) {
        if (onChange) onChange(searchQuery);
        searchStudents();
      } else {
        onSearchResults?.([]);
        if (onChange) onChange("");
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const searchStudents = async () => {
    if (searchQuery.length < 2) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `api/workouts?q=${encodeURIComponent(searchQuery)}`,
      );
      if (!response.ok) {
        throw new Error("Erro ao buscar treinos");
      }

      const data = await response.json();
      onSearchResults?.(data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    onSearchResults?.([]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.length === 0) {
      onSearchResults?.([]);
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-4 w-4 text-white/50"></Search>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="placeholder-white/5-0 w-full rounded-[8px] border border-white/30 bg-[#151515] py-3 pr-10 pl-10 text-white transition-colors focus:border-white/50 focus:ring-0 focus:outline-none"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-white/50 transition-colors hover:text-white"
          >
            <X className="h-4 w-4"></X>
          </button>
        )}
      </div>

      {loading && (
        <div className="absolute top-full right-0 left-0 z-10 mt-1 rounded-[8px] bg-[#151515] p-3">
          <div className="flex items-center gap-2 text-white/70">
            <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white/70"></div>
            <span>Buscando treinos...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute top-full right-0 left-0 z-10 mt-1 rounded-[8px] border border-red-500/30 bg-red-500/10 p-3">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}
