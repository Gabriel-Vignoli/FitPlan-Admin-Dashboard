import EditWorkoutDialog from "./EditWorkoutDialog";
import DeleteButton from "./DeleteButton";
import ExerciseItem from "./ExerciseItem";

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
  isFavorite?: boolean;
  exercises: WorkoutExercise[];
}

interface WorkoutProps {
  workout: Workout;
  onWorkoutUpdated: (updatedWorkout: Workout) => void;
  onWorkoutDeleted: (id: string) => void;
}

export default function WorkoutCard({
  workout,
  onWorkoutUpdated,
  onWorkoutDeleted,
}: WorkoutProps) {
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
        <div className="flex gap-2">
          <EditWorkoutDialog
            onWorkoutUpdated={onWorkoutUpdated}
            workout={workout}
          />
          <DeleteButton
            endpoint="/api/workouts"
            id={workout.id}
            itemName="Treino"
            onDeleted={onWorkoutDeleted}
            variant="default"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="mb-4 flex gap-2 sm:mb-6 sm:gap-4">
        <div className="flex items-center gap-1.5 rounded-86px] bg-white/5 px-2 py-1.5 sm:gap-2 sm:rounded-[8px] sm:px-3 sm:py-2">
          <span className="text-xs whitespace-nowrap text-primary/90 sm:text-sm">
            {totalExercises} exercícios
          </span>
        </div>
        <div className="flex items-center gap-1.5 rounded-[6px] bg-white/5 px-2 py-1.5 sm:gap-2 sm:rounded-[8px] sm:px-3 sm:py-2">
          <span className="text-xs whitespace-nowrap text-white/80 sm:text-sm">
            {totalSets} séries
          </span>
        </div>
      </div>

      {/* Exercises */}
      <div className="space-y-2 sm:space-y-3">
        {workout.exercises.map((exercise) => (
          <ExerciseItem
            key={exercise.id}
            workoutExercise={exercise}
          />
        ))}
      </div>

      {/* Notes section */}
      {workout.exercises.some((exercise) => exercise.notes) && (
        <div className="relative z-10 mt-4 rounded-[8px] border border-white/10 bg-white/5 p-3 sm:mt-6 sm:p-4">
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