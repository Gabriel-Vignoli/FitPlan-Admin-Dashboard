"use client";

import Header from "@/components/Header";
import AlunosTable from "@/components/AlunosTable";
import {
  ArrowDownUp,
  ArrowLeft,
  ArrowRight,
  MoveDown,
  MoveUp,
  Plus,
} from "lucide-react";
import { useState, useEffect } from "react";
import AddAlunoDialog from "@/components/CreateAlunoDialog";
import Loader from "@/components/Loader";
import { usePaginatedAlunos } from "@/hooks/usePaginatedAlunos";
import StudentSearch from "@/components/AlunoSearch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function AlunosPage() {
  function renderPagination() {
    if (!pagination || pagination.totalPages <= 1) return null;
    const allPages = Array.from(
      { length: pagination.totalPages },
      (_, i) => i + 1,
    );
    let pageNumbers: number[] = [];
    if (pagination.totalPages <= 5) {
      pageNumbers = allPages;
    } else if (pagination.currentPage <= 3) {
      pageNumbers = allPages.slice(0, 5);
    } else if (pagination.currentPage >= pagination.totalPages - 2) {
      pageNumbers = allPages.slice(-5);
    } else {
      pageNumbers = allPages.filter(
        (pageNum) =>
          pageNum >= pagination.currentPage - 2 &&
          pageNum <= pagination.currentPage + 2,
      );
    }
    return (
      <div className="mt-6 rounded-[8px] border border-white/20 bg-[#151515] px-4 py-3">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
              <ArrowLeft className="mr-1" /> Anterior
            </Button>
            <div className="flex w-auto justify-center space-x-1">
              {pageNumbers.map((pageNum) => {
                const showOnMobile =
                  pagination.totalPages <= 5 ||
                  pageNum === pagination.currentPage ||
                  pageNum === pagination.currentPage - 1 ||
                  pageNum === pagination.currentPage + 1;
                return (
                  <Button
                    key={pageNum}
                    variant={
                      pageNum === pagination.currentPage
                        ? "secondary"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => goToPage(pageNum)}
                    className={`min-w-[40px] rounded-[8px] font-semibold transition-all duration-200 sm:w-auto ${pageNum === pagination.currentPage ? "border-blue-700 bg-blue-700 text-white" : "border-white/20 text-white/70 hover:bg-blue-700/30 hover:text-white"} ${showOnMobile ? "" : "hidden sm:inline-flex"}`}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={nextPage}
              disabled={!pagination.hasNextPage}
              className="w-full rounded-[8px] sm:w-auto"
            >
              Próxima <ArrowRight className="ml-1" />
            </Button>
          </div>
        </div>
      </div>
    );
  }
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
    <div className="p-5 md:p-8">
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
            <div className="w-full">
              <StudentSearch
                placeholder="Buscar aluno por nome..."
                onSearchChange={setSearchTerm}
              />
            </div>
          </div>

          {/* Active search indicator */}
          {search && (
            <div className="flex items-center text-sm text-white/70">
              <span>Buscando por: </span>
              <span className="ml-1 font-medium text-white">{search}</span>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  updateSearch("");
                }}
                variant={"link"}
                className="text-blue-500"
              >
                Limpar
              </Button>
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
            <div className="mb-4 flex items-center justify-between text-sm text-white/70">
              <div>
                {search ? (
                  <>
                    Mostrando {alunos.length} resultado(s) de{" "}
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
                    de {pagination.totalItems} alunos
                  </>
                )}
              </div>

              {/* Page selector */}
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
          {/* AlunosTable */}
          <AlunosTable
            alunos={alunos}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
            getSortIcon={getSortIcon}
          />

          {/* Pagination */}
          {renderPagination()}
        </div>
      )}
    </div>
  );
}
