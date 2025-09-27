"use client";

import { formatDayofWeekToDay } from "@/lib/utils/formatters";
import { Dumbbell } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import AddWorkoutToAlunoDialog from "./AddWorkoutToAlunoDialog";
import EditStudentWorkoutDialog from "./EditStudentWorkoutDialog";

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

interface AlunoWorkoutsProps {
  id: string;
  workouts: StudentWorkout[];
}

export default function AlunoWorkouts({
  id,
  workouts: initialWorkouts,
}: AlunoWorkoutsProps) {
  const [workouts, setWorkouts] = useState<StudentWorkout[]>(
    initialWorkouts || [],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStudentWorkouts = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/alunos/${id}/workouts`);

      if (!response.ok) {
        setError("Treinos não encontrados");
        return;
      }

      const data = await response.json();
      setWorkouts(data);
    } catch (error) {
      console.error("Erro ao carregar treinos:", error);
      setError("Erro ao carregar os treinos do aluno");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialWorkouts && initialWorkouts.length > 0) {
      setWorkouts(initialWorkouts);
    } else if (id) {
      fetchStudentWorkouts();
    }
  }, [id, initialWorkouts]);

  const handleWorkoutAdded = (newWorkout: StudentWorkout) => {
    setWorkouts((prevWorkouts) => [...prevWorkouts, newWorkout]);
  };

  const handleWorkoutUpdated = (updatedWorkout: StudentWorkout) => {
    setWorkouts((prevWorkouts) =>
      prevWorkouts.map((workout) =>
        workout.id === updatedWorkout.id ? updatedWorkout : workout,
      ),
    );
  };

  if (loading) {
    return (
      <div className="mt-8 w-full max-w-4xl">
        <h3 className="mb-4 text-xl font-semibold">Treinos do Aluno</h3>
        <div className="flex justify-center p-8">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 w-full max-w-4xl">
        <h3 className="mb-4 text-xl font-semibold">Treinos do Aluno</h3>
        <div className="rounded-[8px] border border-red-500/30 bg-red-500/10 p-4">
          <p className="text-red-400">{error}</p>
          <button
            onClick={fetchStudentWorkouts}
            className="mt-2 text-sm text-blue-400 underline hover:text-blue-300"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (!workouts || workouts.length === 0) {
    return (
      <div className="mt-8 w-full max-w-4xl">
        <h3 className="mb-4 text-xl font-semibold">Treinos do Aluno</h3>
        <div className="rounded-[8px] border border-yellow-500/30 bg-yellow-500/10 p-4">
          <p className="text-yellow-400">
            Nenhum treino atribuído a este aluno.
          </p>
        </div>
        <div className="mt-4">
          <AddWorkoutToAlunoDialog
            id={id}
            onWorkoutAdded={handleWorkoutAdded}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 w-full max-w-4xl">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold">Treinos do Aluno</h3>
        <AddWorkoutToAlunoDialog id={id} onWorkoutAdded={handleWorkoutAdded} />
      </div>
      <div className="grid gap-6">
        {workouts
          .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
          .map((studentWorkout) => (
            <div
              key={studentWorkout.id}
              className="rounded-[8px] border border-white/30 bg-[#060606] p-4 shadow-sm"
            >
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h4 className="text-base font-medium md:text-lg">
                    {formatDayofWeekToDay(studentWorkout.dayOfWeek)}:{" "}
                    {studentWorkout.workout.title}
                  </h4>
                  {studentWorkout.workout.description && (
                    <p className="text-xs text-white/60 md:text-sm">
                      {studentWorkout.workout.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium md:text-sm ${
                      studentWorkout.isActive
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {studentWorkout.isActive ? "Ativo" : "Inativo"}
                  </span>
                  <EditStudentWorkoutDialog
                    studentWorkout={studentWorkout}
                    onWorkoutUpdated={handleWorkoutUpdated}
                  ></EditStudentWorkoutDialog>
                </div>
              </div>

              {/* Workout Exercises */}
              {studentWorkout.workout.exercises.length > 0 && (
                <div className="mt-3">
                  <h5 className="mb-2 font-medium">Exercícios:</h5>
                  <div className="space-y-2">
                    {studentWorkout.workout.exercises.map((workoutExercise) => (
                      <div
                        key={workoutExercise.id}
                        className="flex flex-col md:flex-row md:items-center justify-between rounded-[8px] bg-[#101010] p-3 transition hover:scale-[1.01] hover:bg-[#151515]"
                      >
                        <div className="flex flex-1 items-center">
                          {/* Image/Icon */}
                          <div className="mr-3 flex-shrink-0">
                            {workoutExercise.exercise.imageUrl ? (
                              <Image
                                src={workoutExercise.exercise.imageUrl}
                                alt={workoutExercise.exercise.name}
                                width={40}
                                height={40}
                                className="rounded-[8px] object-cover"
                              />
                            ) : (
                              <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#1a1a1a]">
                                <Dumbbell className="h-5 w-5 text-white/70" />
                              </div>
                            )}
                          </div>

                          {/* Exercise info */}
                          <div className="min-w-0 flex-1">
                            <div className="truncate font-medium">
                              {workoutExercise.exercise.name}
                            </div>
                            <div className="text-xs text-white/70 md:text-sm">
                              ({workoutExercise.exercise.targetMuscle})
                            </div>
                          </div>
                        </div>

                        {/* Workout details */}
                        <div className="ml-4 flex-shrink-0 text-right text-xs text-white/70 md:text-sm">
                          <div>
                            {workoutExercise.sets} séries ×{" "}
                            {workoutExercise.reps} reps
                          </div>
                          {(workoutExercise.weight || workoutExercise.rest) && (
                            <div className="mt-1 text-xs">
                              {workoutExercise.weight &&
                                `${workoutExercise.weight}kg`}
                              {workoutExercise.weight &&
                                workoutExercise.rest &&
                                " • "}
                              {workoutExercise.rest &&
                                `${workoutExercise.rest}s`}
                            </div>
                          )}
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
  );
}
