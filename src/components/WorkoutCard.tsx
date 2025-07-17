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
  const totalSets = workout.exercises.reduce((sum, exercise) => sum + exercise.sets, 0);
  const totalExercises = workout.exercises.length;

  return (
    <div className="border border-white/10 bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] rounded-[8px] shadow-2xl p-6 hover:shadow-3xl hover:border-white/20 transition-all duration-300 overflow-hidden">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-2">
            {workout.title}
          </h2>
          <p className="text-sm text-white/60">
            {workout.description}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-4 mb-6">
        <div className="flex items-center gap-2 bg-white/5 rounded-[8px] px-3 py-2">
          <Dumbbell className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-white/80">{totalExercises} exercícios</span>
        </div>
        <div className="flex items-center gap-2 bg-white/5 rounded-[8px] px-3 py-2">
          <Target className="w-4 h-4 text-green-400" />
          <span className="text-sm text-white/80">{totalSets} sets</span>
        </div>
      </div>

      {/* Exercises */}
      <div className="space-y-3">
        {workout.exercises.map((exercise, index) => (
          <ExerciseItem key={exercise.id} exercise={exercise} index={index} />
        ))}
      </div>

      {/* Notes section if any exercise has notes */}
      {workout.exercises.some(exercise => exercise.notes) && (
        <div className="relative z-10 mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
          <h4 className="text-sm font-semibold text-white mb-2">Observações:</h4>
          <div className="space-y-1">
            {workout.exercises
              .filter(exercise => exercise.notes)
              .map(exercise => (
                <p key={exercise.id} className="text-xs text-white/60">
                  <span className="text-white/80 font-medium">{exercise.exercise.name}:</span>{' '}
                  {exercise.notes}
                </p>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ExerciseItem({ exercise, index }: { exercise: WorkoutExercise; index: number }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="flex items-center bg-white/5 backdrop-blur-sm rounded-[8px] p-4 gap-4 hover:bg-white/10 transition-all duration-200 border border-white/5 hover:border-white/10">
      {/* Exercise Image or Fallback */}
      <div className="relative w-16 h-16 rounded-[8px] overflow-hidden bg-white/5">
        {!imageError && exercise.exercise.imageUrl ? (
          <Image
            src={exercise.exercise.imageUrl}
            alt={exercise.exercise.name}
            fill
            className="object-cover"
            sizes="64px"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-600/20 to-gray-700/20 border border-white/10">
            <Dumbbell className="w-8 h-8 text-white/40" />
          </div>
        )}
      </div>

      {/* Exercise Info */}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs bg-primary/70 px-2 py-0.5 rounded-full">
            {index + 1}
          </span>
          <h3 className="font-semibold text-sm">
            {exercise.exercise.name}
          </h3>
        </div>
        <p className="text-xs text-primary flex items-center gap-1">
          <Target className="w-3 h-3" />
          {exercise.exercise.targetMuscle}
        </p>
      </div>

      {/* Exercise Stats */}
      <div className="flex flex-col gap-1 text-xs">
        <div className="flex gap-2">
          <span className="bg-blue-600/20 text-blue-300 px-2 py-1 rounded-[8px] font-medium">
            {exercise.sets}x
          </span>
          <span className="bg-green-600/20 text-green-300 px-2 py-1 rounded-[8px] font-medium">
            {exercise.reps}
          </span>
        </div>
        <div className="flex gap-2">
          {exercise.rest && (
            <span className="bg-purple-600/20 text-purple-300 px-2 py-1 rounded-[8px] font-medium flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {exercise.rest}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}