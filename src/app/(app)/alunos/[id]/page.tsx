"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import StudentInfoComponent from "@/components/AlunoInfoComponent";
import { Button } from "@/components/ui/button";

interface Student {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  birthDate: string;
  cpf: string;
  height: number | null;
  weight: number | null;
  bodyFat: number | null;
  isActive: boolean;
  planId: string;
  paymentStatus: string;
  createdAt: string;
}

interface Plan {
  id: string;
  name: string;
  price: number;
}

export default function EditAlunoPage() {
  const router = useRouter();
  const params = useParams();
  const [student, setStudent] = useState<Student | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudentAndPlan = async () => {
      try {
        const studentResponse = await fetch(`/api/alunos/${params.id}`);
        
        if (!studentResponse.ok) {
          setError("Aluno não encontrado");
          return;
        }

        const studentData = await studentResponse.json();
        setStudent(studentData);

        if (studentData.planId) {
          try {
            const planResponse = await fetch(`/api/plans/${studentData.planId}`);
            
            if (planResponse.ok) {
              const planData = await planResponse.json();
              setPlan(planData);
            } else {
              console.warn("Plano não encontrado para ID:", studentData.planId);
            }
          } catch (planError) {
            console.error("Erro ao carregar plano:", planError);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar aluno:", error);
        setError("Erro ao carregar dados do aluno");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchStudentAndPlan();
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
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <Button
            onClick={handleCancel}
            variant="destructive"
          >
            Voltar
          </Button>
          <h1 className="text-3xl font-bold">Informações do Aluno</h1>
        </div>

        {/* Student Info Component */}
        <StudentInfoComponent student={student} plan={plan} />

        {/* Additional Actions */}
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => router.push(`/alunos/${student.id}/edit`)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Editar Aluno
          </button>
          <Button
            onClick={handleCancel}
            variant="destructive"
          >
            Voltar à Lista
          </Button>
        </div>
      </div>
    </div>
  );
}