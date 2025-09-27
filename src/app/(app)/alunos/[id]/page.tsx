"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import StudentInfoComponent from "@/components/AlunoInfoComponent";
import { Button } from "@/components/ui/button";
import DeleteButton from "@/components/DeleteButton";
import Header from "@/components/Header";
import EditAlunoDialog from "@/components/EditAlunoDialog";
import Loader from "@/components/Loader";
import AlunoWorkouts from "@/components/AlunoWorkouts";

interface Plan {
  id: string;
  name: string;
  price: number;
  duration: number; 
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Exercise {
  id: string;
  name: string;
  targetMuscle: string;
  imageUrl: string;
  videoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface WorkoutExercise {
  id: string;
  workoutId: string;
  exerciseId: string;
  sets: number;
  reps: string;
  weight?: string;
  rest?: string;
  notes?: string;
  order: number;
  exercise: Exercise;
}

interface Workout {
  id: string;
  title: string;
  description?: string;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  exercises: WorkoutExercise[];
}

interface StudentWorkout {
  id: string;
  studentId: string;
  workoutId: string;
  dayOfWeek: number;
  isActive: boolean;
  workout: Workout;
}

interface DialogStudent {
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

interface Student extends DialogStudent {
  updatedAt: string;
  plan?: Plan;
  workouts: StudentWorkout[];
}

export default function AlunoPage() {
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
        
        if (studentData.plan) {
          setPlan(studentData.plan);
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

  const handleStudentUpdated = (updatedStudent: DialogStudent) => {
    const fullUpdatedStudent: Student = {
      ...updatedStudent,
      updatedAt: new Date().toISOString(),
      workouts: [], 
      plan: undefined
    };
    
    setStudent(fullUpdatedStudent);
    
    if (updatedStudent.planId !== student?.planId) {
      (async () => {
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
      })();
    } else {
      if (student?.plan) {
        setPlan(student.plan);
      }
    }
  };

  return (
    <div className="p-5 md:p-8">
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
          
          {/* Workouts Section */}
          <AlunoWorkouts id={student.id} workouts={student.workouts}></AlunoWorkouts>
          
        </div>
      )}
    </div>
  );
}