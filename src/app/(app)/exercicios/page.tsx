"use client";

import CreateExerciseDialog from "@/components/CreateExerciseDialog";
import DeleteButton from "@/components/DeleteButton";
import EditExerciseDialog from "@/components/EditExerciseDialog";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import ExerciseSearch from "@/components/ExerciseSearch";
import { Plus, Dumbbell } from "lucide-react";
import Image from "next/image";

import { usePaginatedExercises } from "@/hooks/usePaginatedExercises";

export default function ExercisesPage() {
  const {
    exercises,
    pagination,
    loading,
    error,
    limit,
    search,
    goToPage,
    nextPage,
    previousPage,
    updateSearch,
    updateLimit,
    refresh,
  } = usePaginatedExercises({
    initialLimit: 10,
    initialSortBy: "createdAt",
    initialSortOrder: "desc",
  });

  const handleExerciseCreated = () => {
    refresh();
  };

  const handleExerciseUpdated = () => {
    refresh();
  };

  const handleExerciseDeleted = () => {
    refresh();
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

        <div className="mt-5">
          <ExerciseSearch
            onSearchResults={() => {}}
            onChange={updateSearch}
            placeholder="Buscar exercício por nome..."
          />
        </div>
      </div>

      {!loading && (
        <div>
          {pagination && (
            <div className="mb-4 flex items-center justify-between text-sm text-white/70">
              <div>
                {search ? (
                  <>
                    Mostrando {exercises.length} resultado(s) de{" "}
                    {pagination.totalItems} para {search}
                  </>
                ) : (
                  <>
                    Mostrando{" "}
                    {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}{" "}
                    a{" "}
                    {Math.min(
                      pagination.currentPage * pagination.itemsPerPage,
                      pagination.totalItems,
                    )}{" "}
                    de {pagination.totalItems} exercícios
                  </>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="limit" className="text-sm font-medium">
                  Mostrar:
                </Label>
                <Select
                  value={String(limit)}
                  onValueChange={(v) => updateLimit(Number(v))}
                >
                  <SelectTrigger className="w-20 rounded-[8px] border-white/40 shadow-[0]">
                    <span>{limit}</span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          {exercises.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center text-center">
              <Dumbbell className="mb-4 h-16 w-16 text-white/40" />
              <p className="text-lg text-white/70">
                Nenhum exercício encontrado
              </p>
              <p className="text-sm text-white/50">
                Adicione seu primeiro exercício para começar
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
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
          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-6 flex flex-col gap-4 rounded-[8px] border border-white/20 bg-[#151515] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-center text-sm text-white/70 sm:text-left">
                  Página{" "}
                  <span className="font-medium text-white">
                    {pagination.currentPage}
                  </span>{" "}
                  de{" "}
                  <span className="font-medium text-white">
                    {pagination.totalPages}
                  </span>
                </p>
              </div>
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={previousPage}
                  disabled={!pagination.hasPreviousPage}
                  className="w-full rounded-[8px] sm:w-auto"
                >
                  Anterior
                </Button>
                <div className="flex w-auto justify-center space-x-1">
                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1,
                  )
                    .filter((pageNum) => {
                      if (pagination.totalPages <= 5) return true;
                      return (
                        pageNum === pagination.currentPage ||
                        pageNum === pagination.currentPage - 1 ||
                        pageNum === pagination.currentPage + 1
                      );
                    })
                    .map((pageNum) => (
                      <Button
                        key={pageNum}
                        variant={
                          pageNum === pagination.currentPage
                            ? "secondary"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => goToPage(pageNum)}
                        className={`min-w-[40px] rounded-[8px] font-semibold transition-all duration-200 sm:w-auto ${pageNum === pagination.currentPage ? "border-blue-700 bg-blue-700 text-white" : "border-white/20 text-white/70 hover:bg-blue-700/30 hover:text-white"}`}
                      >
                        {pageNum}
                      </Button>
                    ))}
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={nextPage}
                  disabled={!pagination.hasNextPage}
                  className="w-full rounded-[8px] sm:w-auto"
                >
                  Próxima
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
