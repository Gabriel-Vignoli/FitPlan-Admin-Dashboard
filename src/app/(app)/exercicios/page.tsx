"use client";

import CreateExerciseDialog from "@/components/CreateExerciseDialog";
import DeleteButton from "@/components/DeleteButton";
import EditExerciseDialog from "@/components/EditExerciseDialog";
import Header from "@/components/Header";
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

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchExercises() {
      setLoading(true);
      try {
        const response = await fetch("/api/exercises");

        if (!response.ok) {
          throw new Error("Failed to fetch exercises");
        }

        const data = await response.json();
        setExercises(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    fetchExercises();
  }, []);

  const handleExerciseCreated = (newExercise: Exercise) => {
    setExercises((prevExercises) => [...prevExercises, newExercise]);
  };

  const handleExerciseUpdated = (updatedExercise: Exercise) => {
    setExercises((prevExercises) =>
      prevExercises.map((exercise) =>
        exercise.id === updatedExercise.id ? updatedExercise : exercise,
      ),
    );
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-white"></div>
          <div className="ml-4 text-white/70">Carregando exercícios...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="rounded-[8px] border border-red-500/30 bg-red-500/10 p-4">
          <p className="text-red-400">Erro ao carregar exercícios: {error}</p>
        </div>
      </div>
    );
  }

  const handleExerciseDeleted = (id: string) => {
    setExercises((prevExercises) =>
      prevExercises.filter((exercise) => exercise.id !== id),
    );
  };

  return (
    <div className="p-8">
      <Header
        title="Gerencie seus exercícios"
        description="Crie exercícios do seu jeito"
        buttonText="Adicionar Exercício"
        icon={<Plus />}
        customButton={
          <CreateExerciseDialog onExerciseCreated={handleExerciseCreated} />
        }
        margin={8}
      />

      {exercises.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center text-center">
          <Dumbbell className="mb-4 h-16 w-16 text-white/40" />
          <p className="text-lg text-white/70">Nenhum exercício encontrado</p>
          <p className="text-sm text-white/50">
            Adicione seu primeiro exercício para começar
          </p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {exercises.map((exercise) => (
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

                <div className="flex gap-2 pt-2">
                  <EditExerciseDialog
                    exercise={exercise}
                    onExerciseUpdated={handleExerciseUpdated}
                  ></EditExerciseDialog>

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
  );
}
