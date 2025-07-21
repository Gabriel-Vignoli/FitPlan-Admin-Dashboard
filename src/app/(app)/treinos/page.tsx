'use client'

import CreateWorkoutDialog from "@/components/CreateWorkoutDialog";
import Header from "@/components/Header";
import Loader from "@/components/Loader";
import WorkoutCard from "@/components/WorkoutCard";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

interface Exercise {
  id: string;
  name: string;
  targetMuscle: string;
  imageUrl: string;
  videoUrl?: string;
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
  description: string;
  isFavorite: boolean;
  exercises: WorkoutExercise[];
}

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWorkouts() {
      try {
        const response = await fetch("/api/workouts");

        if (!response.ok) {
          throw new Error("Failed to fetch workouts");
        }

        const data = await response.json();
        setWorkouts(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    fetchWorkouts();
  }, []);

  const handleWorkoutCreated = (newWorkout: Workout) => {
    setWorkouts((prevWorkouts) => [...prevWorkouts, newWorkout]);
  };

  const handleWorkoutUpdated = (updatedWorkout: Workout) => {
    setWorkouts((prevWorkouts) =>
      prevWorkouts.map((workout) =>
        workout.id === updatedWorkout.id ? updatedWorkout : workout
      )
    );
  };

  const handleWorkoutDeleted = (id: string) => {
    setWorkouts((prevWorkouts) => prevWorkouts.filter((workout) => workout.id !== id));
  };

  return (
    <div className="p-8">
      <Header
        title="Gerencie seus treinos"
        description="Escolha os exercícios ideais para os treinos de seus alunos"
        buttonText="Adicionar Treino"
        icon={<Plus />}
        customButton={<CreateWorkoutDialog onWorkoutCreated={handleWorkoutCreated}></CreateWorkoutDialog>}
        margin={8}
      />

      {loading ? (
        <Loader text="Carregando treinos..." size="lg" />
      ) : error ? (
        <div className="rounded-[8px] border border-red-500/30 bg-red-500/10 p-4">
          <p className="text-red-400">Erro ao carregar treinos: {error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 auto-rows-fr">
          {workouts.map((workout) => (
            <WorkoutCard 
              key={workout.id} 
              workout={workout} 
              onWorkoutUpdated={handleWorkoutUpdated}
              onWorkoutDeleted={handleWorkoutDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
}