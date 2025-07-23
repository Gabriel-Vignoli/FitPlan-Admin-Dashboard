"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import StudentInfoComponent from "@/components/AlunoInfoComponent";
import { Button } from "@/components/ui/button";
import DeleteButton from "@/components/DeleteButton";
import Header from "@/components/Header";
import EditAlunoDialog from "@/components/EditAlunoDialog";
import Loader from "@/components/Loader";

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
          
          {/* Workouts Section */}
          {student.workouts && student.workouts.length > 0 && (
            <div className="mt-8 w-full max-w-4xl">
              <h3 className="text-xl font-semibold mb-4">Treinos do Aluno</h3>
              <div className="grid gap-4">
                {student.workouts
                  .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
                  .map((studentWorkout) => (
                    <div
                      key={studentWorkout.id}
                      className="border rounded-lg p-4 bg-white shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-lg">
                            {studentWorkout.workout.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Dia da semana: {studentWorkout.dayOfWeek}
                          </p>
                          {studentWorkout.workout.description && (
                            <p className="text-sm text-gray-600 mt-1">
                              {studentWorkout.workout.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {studentWorkout.workout.isFavorite && (
                            <span className="text-yellow-500">⭐</span>
                          )}
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              studentWorkout.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {studentWorkout.isActive ? "Ativo" : "Inativo"}
                          </span>
                        </div>
                      </div>
                      
                      {/* Workout Exercises */}
                      {studentWorkout.workout.exercises.length > 0 && (
                        <div className="mt-3">
                          <h5 className="font-medium mb-2">Exercícios:</h5>
                          <div className="space-y-2">
                            {studentWorkout.workout.exercises.map((workoutExercise) => (
                              <div
                                key={workoutExercise.id}
                                className="flex items-center justify-between p-2 bg-gray-50 rounded"
                              >
                                <div className="flex-1">
                                  <span className="font-medium">
                                    {workoutExercise.exercise.name}
                                  </span>
                                  <span className="text-sm text-gray-600 ml-2">
                                    ({workoutExercise.exercise.targetMuscle})
                                  </span>
                                </div>
                                <div className="text-sm text-gray-600">
                                  {workoutExercise.sets} sets × {workoutExercise.reps} reps
                                  {workoutExercise.weight && ` - ${workoutExercise.weight}`}
                                  {workoutExercise.rest && ` - Rest: ${workoutExercise.rest}`}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
          
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