import { Search, X } from "lucide-react";
import React, { useEffect, useState } from "react";

interface Exercise {
  id: string;
  name: string;
  targetMuscle: string;
}

interface ExerciseSearchProps {
  onExerciseSelect?: (exercise: Exercise) => void;
  onSearchResults?: (exercises: Exercise[]) => void;
  placeholder?: string;
}

export default function ExerciseSearch({
  onSearchResults,
  placeholder = "Buscar exercicio por nome...",
}: ExerciseSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.length >= 2) {
        searchExercises();
      } else {
        onSearchResults?.([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const searchExercises = async () => {
    if (searchQuery.length < 2) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/exercises?q=${encodeURIComponent(searchQuery)}`,
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar alunos");
      }

      const data = await response.json();
      onSearchResults?.(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro desconhecido";
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
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Search className="h-4 w-4 text-white/50"></Search>
      </div>

      <input
        type="text"
        value={searchQuery}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="w-full rounded-[8px] border border-white/30 bg-[#151515] py-3 pr-10 pl-10 text-white placeholder-white/50 transition-colors focus:border-white/50 focus:ring-0 focus:outline-none"
      />

      {searchQuery && (
        <button
          onClick={clearSearch}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-white/50 transition-colors hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      {loading && (
        <div className="absolute top-full right-0 left-0 z-10 mt-1 rounded-[8px] border border-white/30 bg-[#151515] p-3">
          <div className="flex items-center gap-2 text-white/70">
            <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white/70"></div>
            <span>Buscando exercicios...</span>
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
