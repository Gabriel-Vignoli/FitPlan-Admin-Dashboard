"use client";

import CreateWorkoutDialog from "@/components/CreateWorkoutDialog";
import Header from "@/components/Header";
import Loader from "@/components/Loader";
import WorkoutCard from "@/components/WorkoutCard";
import WorkoutSearch from "@/components/WorkoutSearch";
import { Plus } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { usePaginatedWorkouts } from "@/hooks/usePaginatedWorkouts";

export default function WorkoutsPage() {
  const {
    workouts,
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
  } = usePaginatedWorkouts({
    initialLimit: 10,
    initialSortBy: "createdAt",
    initialSortOrder: "desc",
  });

  const handleWorkoutCreated = () => {
    refresh();
  };

  const handleWorkoutUpdated = () => {
    refresh();
  };

  const handleWorkoutDeleted = () => {
    refresh();
  };

  return (
    <div className="p-8">
      <Header
        title="Gerencie seus treinos"
        description="Escolha os exercícios ideais para os treinos de seus alunos"
        buttonText="Adicionar Treino"
        icon={<Plus />}
        customButton={
          <CreateWorkoutDialog onWorkoutCreated={handleWorkoutCreated} />
        }
        margin={8}
      />

      <div className="mb-8">
        <WorkoutSearch
          onChange={updateSearch}
          placeholder="Buscar treino por nome..."
        />
      </div>

      {error && (
        <div className="rounded-[8px] border border-red-500/30 bg-red-500/10 p-4">
          <p className="text-red-400">Erro ao carregar treinos: {error}</p>
        </div>
      )}

      {!loading && pagination && (
        <div className="mb-4 flex items-center justify-between text-sm text-white/70">
          <div>
            {search ? (
              <>
                Mostrando {workouts.length} resultado(s) de{" "}
                {pagination.totalItems} para {search}
              </>
            ) : (
              <>
                Mostrando{" "}
                {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} a{" "}
                {Math.min(
                  pagination.currentPage * pagination.itemsPerPage,
                  pagination.totalItems,
                )}{" "}
                de {pagination.totalItems} treinos
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

      {loading ? (
        <Loader text="Carregando treinos..." size="lg" />
      ) : (
        <div>
          <div className="grid auto-rows-fr grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {workouts.map((workout) => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                onWorkoutUpdated={handleWorkoutUpdated}
                onWorkoutDeleted={handleWorkoutDeleted}
              />
            ))}
          </div>

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
