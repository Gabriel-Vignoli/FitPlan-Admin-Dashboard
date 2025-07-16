"use client";

import CreateExerciseDialog from "@/components/CreateExerciseDialog";
import DeleteButton from "@/components/DeleteButton";
import EditExerciseDialog from "@/components/EditExerciseDialog";
import Header from "@/components/Header";
import Loader from "@/components/Loader";
import ExerciseSearch from "@/components/ExerciseSearch";
import { Plus, Dumbbell } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Exercise {
  id: string;
  name: string;
  targetMuscle: string;
  imageUrl: string;
  videoUrl: string;
}

interface SearchExercise {
  id: string;
  name: string;
  targetMuscle: string;
}

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/exercises");

      if (!response.ok) {
        throw new Error("Failed to fetch exercises");
      }

      const data = await response.json();
      setExercises(data);
      setFilteredExercises(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleExerciseCreated = (newExercise: Exercise) => {
    setExercises((prevExercises) => [...prevExercises, newExercise]);
    setFilteredExercises((prevExercises) => [...prevExercises, newExercise]);
  };

  const handleExerciseUpdated = (updatedExercise: Exercise) => {
    setExercises((prevExercises) =>
      prevExercises.map((exercise) =>
        exercise.id === updatedExercise.id ? updatedExercise : exercise,
      ),
    );
    setFilteredExercises((prevExercises) =>
      prevExercises.map((exercise) =>
        exercise.id === updatedExercise.id ? updatedExercise : exercise,
      ),
    );
  };

  const handleExerciseDeleted = (id: string) => {
    setExercises((prevExercises) =>
      prevExercises.filter((exercise) => exercise.id !== id),
    );
    setFilteredExercises((prevExercises) =>
      prevExercises.filter((exercise) => exercise.id !== id),
    );
  };

  const handleSearchResults = (searchResults: SearchExercise[]) => {
    if (searchResults.length === 0) {
      setFilteredExercises(exercises);
      setIsSearching(false);
    } else {
      const searchIds = searchResults.map((exercise) => exercise.id);
      const filtered = exercises.filter((exercise) =>
        searchIds.includes(exercise.id),
      );
      setFilteredExercises(filtered);
      setIsSearching(true);
    }
  };

  if (error) {
    return (
      <div className="p-8">
        <div className="rounded-[8px] border border-red-500/30 bg-red-500/10 p-4">
          <p className="text-red-400">Erro ao carregar exercícios: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-10">
        <Header
          title="Gerencie seus exercícios"
          description="Crie exercícios do seu jeito"
          buttonText="Adicionar Exercício"
          icon={<Plus />}
          customButton={
            <CreateExerciseDialog onExerciseCreated={handleExerciseCreated} />
          }
          margin={5}
        />

        {loading ? (
          <Loader text="Carregando exercícios..." size="lg" />
        ) : (
          <div className="mt-5">
            <ExerciseSearch
              onSearchResults={handleSearchResults}
              placeholder="Buscar exercício por nome..."
            />
          </div>
        )}
      </div>

      {!loading && (
        <div>
          {isSearching && (
            <div className="mb-4 text-sm text-white/70">
              Mostrando {filteredExercises.length} resultado(s) da busca
            </div>
          )}

          {filteredExercises.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center text-center">
              <Dumbbell className="mb-4 h-16 w-16 text-white/40" />
              <p className="text-lg text-white/70">
                {isSearching
                  ? "Nenhum exercício encontrado"
                  : "Nenhum exercício encontrado"}
              </p>
              <p className="text-sm text-white/50">
                {isSearching
                  ? "Tente buscar com outros termos"
                  : "Adicione seu primeiro exercício para começar"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {filteredExercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className="group hover:shadow-primary/20 overflow-hidden rounded-[8px] border border-white/10 bg-white/5 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="relative h-48 w-full bg-gradient-to-br from-[#363636] to-[#101010]">
                    {exercise.imageUrl ? (
                      <Image
                        src={exercise.imageUrl}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        alt={`Imagem do exercício ${exercise.name}`}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Dumbbell className="h-16 w-16 text-white/40" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 p-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-white">
                        {exercise.name}
                      </h3>

                      <p className="text-base font-medium text-white/70">
                        {exercise.targetMuscle}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <EditExerciseDialog
                        exercise={exercise}
                        onExerciseUpdated={handleExerciseUpdated}
                      />

                      <DeleteButton
                        id={exercise.id}
                        endpoint="/api/exercises"
                        itemName="exercicio"
                        onDeleted={handleExerciseDeleted}
                        variant="button"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
