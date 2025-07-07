"use client";

import Head from "@/components/Header";
import AlunosTable from "@/components/AlunosTable";

import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import AddAlunoDialog from "@/components/AddAlunoDialog";

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

export default function AlunosPage() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAlunos() {
      try {
        const response = await fetch("/api/alunos");

        if (!response.ok) {
          throw new Error("Failed to fetch alunos");
        }

        const data = await response.json();
        setAlunos(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    fetchAlunos();
  }, []);

  const handleAlunoCreated = () => {
    fetchAlunos();
  };

  const fetchAlunos = async () => {
    try {
      const response = await fetch("/api/alunos");

      if (!response.ok) {
        throw new Error("Failed to fetch alunos");
      }

      const data = await response.json();
      setAlunos(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex h-64 items-center justify-center">
          <div className="text-white/70">Carregando alunos...</div>
        </div>
      </div>
    );
  }

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
        <Head
          buttonText="Adicionar Aluno"
          title="Gerenciar Alunos"
          description="Adicione, exclua, edite alunos e também adicione seus treinos"
          icon={<Plus />}
          customButton={<AddAlunoDialog onAlunoCreated={handleAlunoCreated} />}
          margin={5}
        />
        <div className="mt-5 min-w-full rounded-[8px] border border-white/30 bg-[#151515] px-4 py-2 text-white/30">
          Procurar Aluno
        </div>
      </div>

      <AlunosTable alunos={alunos} />
    </div>
  );
}