"use client";

import Header from "@/components/Header";
import AlunosTable from "@/components/AlunosTable";
import { ArrowDownUp, MoveDown, MoveUp, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import AddAlunoDialog from "@/components/CreateAlunoDialog";
import Loader from "@/components/Loader";
import { usePaginatedAlunos } from "@/hooks/usePaginatedAlunos";
import StudentSearch from "@/components/AlunoSearch";

export default function AlunosPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const {
    alunos,
    pagination,
    loading,
    error,
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
  } = usePaginatedAlunos({
    initialLimit: 10,
    initialSortBy: "createdAt",
    initialSortOrder: "desc",
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      updateSearch(searchTerm);
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [searchTerm, updateSearch]);

  const handleAlunoCreated = () => {
    refresh();
  };

  const handleSortChange = (field: string) => {
    const newOrder = sortBy === field && sortOrder === "desc" ? "asc" : "desc";
    updateSort(field, newOrder);
  };

  const getSortIcon = (field: string) => {
    if (sortBy !== field) return <ArrowDownUp size={16}></ArrowDownUp>;
    return sortOrder === "asc" ? (
      <MoveUp size={16}></MoveUp>
    ) : (
      <MoveDown size={16}></MoveDown>
    );
  };

  if (error) {
    return (
      <div className="p-8">
        <div className="rounded-[8px] border border-red-500/30 bg-red-500/10 p-4">
          <p className="text-red-400">Erro ao carregar alunos: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-10">
        <Header
          buttonText="Adicionar Aluno"
          title="Gerenciar Alunos"
          description="Adicione, exclua, edite alunos e também adicione seus treinos"
          icon={<Plus />}
          customButton={<AddAlunoDialog onAlunoCreated={handleAlunoCreated} />}
          margin={5}
        />

        {/* Search and Controls */}
        <div className="mt-6 space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Search Input */}
            <div className="max-w-md flex-1">
              <StudentSearch
                placeholder="Buscar aluno por nome..."
                onSearchChange={setSearchTerm}
              />
            </div>

            {/* Items per page selector */}
            <div className="flex items-center space-x-2 text-white/70">
              <label htmlFor="limit" className="text-sm font-medium">
                Mostrar:
              </label>
              <select
                id="limit"
                value={limit}
                onChange={(e) => updateLimit(parseInt(e.target.value))}
                className="rounded-md border border-white/20 bg-[#151515] px-3 py-1 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm">por página</span>
            </div>
          </div>

          {/* Active search indicator */}
          {search && (
            <div className="flex items-center text-sm text-white/70">
              <span>Buscando por: </span>
              <span className="ml-1 font-medium text-white">{search}</span>
              <button
                onClick={() => {
                  setSearchTerm("");
                  updateSearch("");
                }}
                className="ml-2 text-indigo-400 hover:text-indigo-300"
              >
                Limpar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader text="Carregando alunos..." size="lg" />
        </div>
      )}

      {/* Content */}
      {!loading && (
        <div>
          {/* Results info */}
          {pagination && (
            <div className="mb-4 text-sm text-white/70">
              {search ? (
                <>
                  Mostrando {alunos.length} resultado(s) de{" "}
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
                  de {pagination.totalItems} alunos
                </>
              )}
            </div>
          )}

          {/* Updated AlunosTable with sorting */}
          <AlunosTable
            alunos={alunos}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
            getSortIcon={getSortIcon}
          />

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between rounded-[8px] border border-white/20 bg-[#151515] px-4 py-3">
              <div className="flex flex-1 items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">
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

                <div className="flex items-center space-x-2">
                  <button
                    onClick={previousPage}
                    disabled={!pagination.hasPreviousPage}
                    className="relative inline-flex items-center rounded-md border border-white/20 bg-[#101010] px-4 py-2 text-sm font-medium text-white/70 hover:bg-white/5 disabled:cursor-not-allowed disabled:bg-[#101010] disabled:text-white/30"
                  >
                    Anterior
                  </button>

                  <div className="flex space-x-1">
                    {Array.from(
                      { length: Math.min(5, pagination.totalPages) },
                      (_, i) => {
                        let pageNum;
                        if (pagination.totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (pagination.currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (
                          pagination.currentPage >=
                          pagination.totalPages - 2
                        ) {
                          pageNum = pagination.totalPages - 4 + i;
                        } else {
                          pageNum = pagination.currentPage - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => goToPage(pageNum)}
                            className={`relative inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium ${
                              pageNum === pagination.currentPage
                                ? "z-10 border-indigo-500 bg-indigo-500 text-white"
                                : "border-white/20 bg-[#101010] text-white/70 hover:bg-white/5"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      },
                    )}
                  </div>

                  <button
                    onClick={nextPage}
                    disabled={!pagination.hasNextPage}
                    className="relative inline-flex items-center rounded-md border border-white/20 bg-[#101010] px-4 py-2 text-sm font-medium text-white/70 hover:bg-white/5 disabled:cursor-not-allowed disabled:bg-[#101010] disabled:text-white/30"
                  >
                    Próxima
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
