"use client";

import Header from "@/components/Header";
import AlunosTable from "@/components/AlunosTable";
import StudentSearch from "@/components/AlunoSearch";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import AddAlunoDialog from "@/components/CreateAlunoDialog";
import Loader from "@/components/Loader";

interface Aluno {
  id: string;
  name: string;
  phone: string;
  createdAt: string;
  paymentStatus: string;
  plan: {
    name: string;
  };
}

interface SearchStudent {
  id: string;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
}

export default function AlunosPage() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [filteredAlunos, setFilteredAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchAlunos();
  }, []);

  const handleAlunoCreated = () => {
    fetchAlunos();
  };

  const fetchAlunos = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/alunos");

      if (!response.ok) {
        throw new Error("Failed to fetch alunos");
      }

      const data = await response.json();
      setAlunos(data);
      setFilteredAlunos(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchResults = (searchResults: SearchStudent[]) => {
    if (searchResults.length === 0) {
      setFilteredAlunos(alunos);
      setIsSearching(false);
    } else {
      const searchIds = searchResults.map(student => student.id);
      const filtered = alunos.filter(aluno => searchIds.includes(aluno.id));
      setFilteredAlunos(filtered);
      setIsSearching(true);
    }
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

        {loading ? (
          <Loader text="Carregando alunos..." size="lg" />
        ) : (
          <div className="mt-5">
            <StudentSearch
              onSearchResults={handleSearchResults}
              placeholder="Buscar aluno por nome..."
            />
          </div>
        )}
      </div>

      {!loading && (
        <div>
          {isSearching && (
            <div className="mb-4 text-sm text-white/70">
              Mostrando {filteredAlunos.length} resultado(s) da busca
            </div>
          )}
          <AlunosTable alunos={filteredAlunos} />
        </div>
      )}
    </div>
  );
}