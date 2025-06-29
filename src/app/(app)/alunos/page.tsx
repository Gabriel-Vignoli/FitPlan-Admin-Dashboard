'use client'

import { useEffect, useState } from "react";

interface Aluno {
  id: string; 
  name: string;
  createdAt?: string;
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
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    fetchAlunos();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Alunos</h1>
      {alunos.map((aluno) => (
        <div key={aluno.id} className="p-4 border-b">   
          <h2 className="text-lg font-semibold">{aluno.name}</h2>
        </div>
      ))}
    </div>
  );
}