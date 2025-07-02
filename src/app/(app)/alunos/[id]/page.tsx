"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Aluno {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  cpf: string;
  planId: string;
}

export default function AlunoDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAluno = async () => {
      if (!id) return;
      
      try {
        const response = await fetch(`/api/alunos/${id}`);
        if (response.ok) {
          const alunoData = await response.json();
          setAluno(alunoData);
        } else {
          setError("Aluno não encontrado");
        }
      } catch (error) {
        console.error("Erro ao carregar aluno:", error);
        setError("Erro ao carregar dados do aluno");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAluno();
  }, [id]);

  if (isLoading) {
    return <div className="p-4">Carregando...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!aluno) {
    return <div className="p-4">Aluno não encontrado</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Detalhes do Aluno</h1>
      <div className="space-y-2">
        <p><strong>ID:</strong> {id}</p>
        <p><strong>Nome:</strong> {aluno.name}</p>
      </div>
    </div>
  );
}