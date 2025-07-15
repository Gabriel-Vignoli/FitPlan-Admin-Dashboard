"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import StudentInfoComponent from "@/components/AlunoInfoComponent";
import { Button } from "@/components/ui/button";
import DeleteButton from "@/components/DeleteButton";
import Header from "@/components/Header";
import EditAlunoDialog from "@/components/EditAlunoDialog";
import Loader from "@/components/Loader";

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
  duration: number;
  description: string;
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
            const planResponse = await fetch(
              `/api/plans/${studentData.planId}`,
            );

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

  const handleCancel = () => {
    router.back();
  };

  const handleStudentDeleted = () => {
    setTimeout(() => {
      router.back();
      alert("Aluno deletado com sucesso");
    }, 3000);
  };

  const handleStudentUpdated = async (updatedStudent: Student) => {
    setStudent(updatedStudent);
    
    if (updatedStudent.planId !== student?.planId) {
      try {
        const planResponse = await fetch(`/api/plans/${updatedStudent.planId}`);
        if (planResponse.ok) {
          const planData = await planResponse.json();
          setPlan(planData);
        } else {
          console.warn("Plano não encontrado para ID:", updatedStudent.planId);
          setPlan(null);
        }
      } catch (planError) {
        console.error("Erro ao carregar plano:", planError);
        setPlan(null);
      }
    }
  };

  return (
    <div className="p-8">
      <Header
        buttonText="Voltar"
        description="Veja todos os dados de seu aluno"
        title="Dados do Aluno"
        customButton={
          <Button onClick={handleCancel} variant="destructive">
            Voltar
          </Button>
        }
      />

      {isLoading ? (
        <Loader text="Carregando dados do aluno..." size="lg" />
      ) : error ? (
        <div className="rounded-[8px] border border-red-500/30 bg-red-500/10 p-4">
          <p className="text-red-400">Erro ao carregar dados: {error}</p>
        </div>
      ) : !student ? (
        <div className="rounded-[8px] border border-red-500/30 bg-red-500/10 p-4">
          <p className="text-red-400">Aluno não encontrado</p>
        </div>
      ) : (
        <div className="flex items-center flex-col">
          {/* Student Info Component */}
          <StudentInfoComponent student={student} plan={plan} />
          {/* Additional Actions */}
          <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
            <EditAlunoDialog student={student} onStudentUpdated={handleStudentUpdated} />
            <DeleteButton
              endpoint="/api/alunos"
              itemName="Aluno"
              id={student.id}
              variant="button"
              onDeleted={handleStudentDeleted}
            />
          </div>
        </div>
      )}
    </div>
  );
}