import { Clock, Dumbbell, Target } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

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

interface WorkoutProps {
  workout: Workout;
}

export default function WorkoutCard({ workout }: WorkoutProps) {
  const totalSets = workout.exercises.reduce(
    (sum, exercise) => sum + exercise.sets,
    0,
  );
  const totalExercises = workout.exercises.length;

  return (
    <div className="hover:shadow-3xl hover:shadow-primary/20 cursor-pointer overflow-hidden rounded-[8px] border border-white/10 bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] p-3 shadow-md transition-all duration-200 hover:scale-105 hover:scale-[1.01] hover:border-white/20 sm:p-6">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between sm:mb-6">
        <div className="flex-1">
          <h2 className="mb-1 text-lg leading-tight font-bold sm:mb-2 sm:text-2xl">
            {workout.title}
          </h2>
          <p className="line-clamp-2 text-xs text-white/60 sm:text-sm">
            {workout.description}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-4 flex gap-2 sm:mb-6 sm:gap-4">
        <div className="flex items-center gap-1.5 rounded-[6px] bg-white/5 px-2 py-1.5 sm:gap-2 sm:rounded-[8px] sm:px-3 sm:py-2">
          <Dumbbell className="h-3 w-3 flex-shrink-0 text-blue-400 sm:h-4 sm:w-4" />
          <span className="text-xs whitespace-nowrap text-white/80 sm:text-sm">
            {totalExercises} exercícios
          </span>
        </div>
        <div className="flex items-center gap-1.5 rounded-[6px] bg-white/5 px-2 py-1.5 sm:gap-2 sm:rounded-[8px] sm:px-3 sm:py-2">
          <Target className="h-3 w-3 flex-shrink-0 text-green-400 sm:h-4 sm:w-4" />
          <span className="text-xs whitespace-nowrap text-white/80 sm:text-sm">
            {totalSets} sets
          </span>
        </div>
      </div>

      {/* Exercises */}
      <div className="space-y-2 sm:space-y-3">
        {workout.exercises.map((exercise, index) => (
          <ExerciseItem key={exercise.id} exercise={exercise} index={index} />
        ))}
      </div>

      {/* Notes section if any exercise has notes */}
      {workout.exercises.some((exercise) => exercise.notes) && (
        <div className="relative z-10 mt-4 rounded-xl border border-white/10 bg-white/5 p-3 sm:mt-6 sm:p-4">
          <h4 className="mb-2 text-xs font-semibold text-white sm:text-sm">
            Observações:
          </h4>
          <div className="space-y-1">
            {workout.exercises
              .filter((exercise) => exercise.notes)
              .map((exercise) => (
                <p key={exercise.id} className="text-xs text-white/60">
                  <span className="font-medium text-white/80">
                    {exercise.exercise.name}:
                  </span>{" "}
                  {exercise.notes}
                </p>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ExerciseItem({
  exercise,
  index,
}: {
  exercise: WorkoutExercise;
  index: number;
}) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="flex items-center gap-2.5 rounded-[6px] border border-white/5 bg-white/5 p-2.5 backdrop-blur-sm transition-all duration-200 hover:border-white/10 hover:bg-white/10 sm:gap-4 sm:rounded-[8px] sm:p-4">
      {/* Exercise Image or Fallback */}
      <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-[6px] bg-white/5 sm:h-12 sm:w-12 sm:rounded-[8px] lg:h-16 lg:w-16">
        {!imageError && exercise.exercise.imageUrl ? (
          <Image
            src={exercise.exercise.imageUrl}
            alt={exercise.exercise.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 40px, (max-width: 1024px) 48px, 64px"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center border border-white/10 bg-gradient-to-br from-gray-600/20 to-gray-700/20">
            <Dumbbell className="h-4 w-4 text-white/40 sm:h-5 sm:w-5 lg:h-8 lg:w-8" />
          </div>
        )}
      </div>

      {/* Exercise Info */}
      <div className="min-w-0 flex-1">
        <div className="mb-0.5 flex items-center gap-1.5 sm:mb-1 sm:gap-2">
          <span className="bg-primary/70 flex-shrink-0 rounded-full px-1.5 py-0.5 text-xs sm:px-2">
            {index + 1}
          </span>
          <h3 className="truncate text-xs font-semibold sm:text-sm">
            {exercise.exercise.name}
          </h3>
        </div>
        <p className="text-primary flex items-center gap-1 truncate text-xs">
          <Target className="h-2.5 w-2.5 flex-shrink-0 sm:h-3 sm:w-3" />
          <span className="truncate">{exercise.exercise.targetMuscle}</span>
        </p>
      </div>

      {/* Exercise Stats */}
      <div className="flex flex-shrink-0 flex-col gap-1 text-xs">
        <div className="flex gap-1 sm:gap-2">
          <span className="rounded-[4px] bg-blue-600/20 px-1.5 py-0.5 text-xs font-medium text-blue-300 sm:rounded-[6px] sm:px-2 sm:py-1">
            {exercise.sets}x
          </span>
          <span className="rounded-[4px] bg-green-600/20 px-1.5 py-0.5 text-xs font-medium text-green-300 sm:rounded-[6px] sm:px-2 sm:py-1">
            {exercise.reps}
          </span>
        </div>
        {exercise.rest && (
          <div className="flex gap-1 sm:gap-2">
            <span className="flex items-center gap-1 rounded-[4px] bg-purple-600/20 px-1.5 py-0.5 text-xs font-medium text-purple-300 sm:rounded-[6px] sm:px-2 sm:py-1">
              <Clock className="h-2.5 w-2.5 flex-shrink-0 sm:h-3 sm:w-3" />
              <span className="whitespace-nowrap">{exercise.rest}</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
