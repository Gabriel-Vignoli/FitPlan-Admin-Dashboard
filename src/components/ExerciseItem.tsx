import { Dumbbell } from "lucide-react";
import Image from "next/image";

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

interface ExerciseItemProps {
  workoutExercise: WorkoutExercise;
  onClick?: () => void;
  className?: string;
}

export default function ExerciseItem({
  workoutExercise,
  onClick,
  className = "",
}: ExerciseItemProps) {
  return (
    <div
      onClick={onClick}
      className={`group flex flex-col md:flex-row md:items-center justify-between rounded-[8px] bg-[#101010] p-3 transition hover:scale-[1.01] hover:bg-[#151515] ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      <div className="flex flex-1 items-center">
        {/* Image/Icon */}
        <div className="mr-3 flex-shrink-0 relative">
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
        <div className="min-w-0 flex-1 relative">
          <div className="truncate font-medium">
            {workoutExercise.exercise.name}
          </div>
          <div className="text-xs text-white/70 md:text-sm">
            ({workoutExercise.exercise.targetMuscle})
          </div>
          
          {/* Tooltip on hover */}
          <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block z-10">
            <div className="bg-black/90 text-white text-xs rounded-[6px] px-3 py-1.5 whitespace-nowrap shadow-lg">
              {workoutExercise.exercise.name}
              <div className="absolute top-full left-4 -mt-1">
                <div className="border-4 border-transparent border-t-black/90"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Workout details */}
      <div className="ml-4 mt-2 flex-shrink-0 text-left md:mt-0 md:text-right text-xs text-white/70 md:text-sm">
        <div>
          {workoutExercise.sets} séries × {workoutExercise.reps} reps
        </div>
        {(workoutExercise.weight || workoutExercise.rest) && (
          <div className="mt-1 text-xs">
            {workoutExercise.weight && `${workoutExercise.weight}`}
            {workoutExercise.weight && workoutExercise.rest && " • "}
            {workoutExercise.rest && `${workoutExercise.rest}`}
          </div>
        )}
        {workoutExercise.notes && (
          <div className="mt-1 text-xs italic text-white/50">
            {workoutExercise.notes}
          </div>
        )}
      </div>
    </div>
  );
}