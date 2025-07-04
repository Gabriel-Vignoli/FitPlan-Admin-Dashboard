"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import EditAlunoForm from "@/components/EditAlunoForm";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Student {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  birthDate: string;
  cpf: string | null;
  height: number | null;
  weight: number | null;
  bodyFat: number | null;
  isActive: boolean;
  planId: string;
  paymentStatus: string;
  createdAt: string;
}

export default function EditAlunoPage() {
  const router = useRouter();
  const params = useParams();
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetch(`/api/alunos/${params.id}`);
        
        if (response.ok) {
          const studentData = await response.json();
          setStudent(studentData);
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

    if (params.id) {
      fetchStudent();
    }
  }, [params.id]);

  const handleSuccess = () => {
    router.push("/alunos");
  };

  const handleCancel = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-white text-xl">Carregando dados do aluno...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center mt-8">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex justify-center mt-8">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>Aluno não encontrado</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex justify-center mt-8">
      <EditAlunoForm 
        student={student}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
}