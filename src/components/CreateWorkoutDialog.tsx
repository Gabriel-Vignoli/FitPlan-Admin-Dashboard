import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Plus, X, Search } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

interface Exercise {
  id: string;
  name: string;
  targetMuscle: string;
  imageUrl: string;
  videoUrl?: string;
}

interface WorkoutExerciseData {
  exerciseId: string;
  exercise: Exercise;
  sets: number;
  reps: string;
  weight?: string;
  rest?: string;
  notes?: string;
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

interface CreateWorkoutDialogProps {
  onWorkoutCreated: (workout: Workout) => void;
}

export default function CreateWorkoutDialog({
  onWorkoutCreated,
}: CreateWorkoutDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingExercises, setLoadingExercises] = useState(false);
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [selectedExercises, setSelectedExercises] = useState<
    WorkoutExerciseData[]
  >([]);

  useEffect(() => {
    if (open && availableExercises.length === 0) {
      fetchExercises();
    }
  }, [open]);

  const fetchExercises = async () => {
    setLoadingExercises(true);
    try {
      const response = await fetch("/api/exercises?limit=all");
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setAvailableExercises(data);
        } else if (data && data.data && Array.isArray(data.data.exercises)) {
          setAvailableExercises(data.data.exercises);
        } else {
          setAvailableExercises([]);
        }
      }
    } catch (error) {
      console.error("Error fetching exercises:", error);
    } finally {
      setLoadingExercises(false);
    }
  };

  const filteredExercises = availableExercises.filter(
    (exercise) =>
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.targetMuscle.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const addExercise = (exercise: Exercise) => {
    if (!selectedExercises.some((e) => e.exerciseId === exercise.id)) {
      setSelectedExercises([
        ...selectedExercises,
        {
          exerciseId: exercise.id,
          exercise,
          sets: 3,
          reps: "10",
          rest: "60s",
          notes: "",
        },
      ]);
    }
    setShowExerciseSelector(false);
    setSearchTerm("");
  };

  const removeExercise = (exerciseId: string) => {
    setSelectedExercises(
      selectedExercises.filter((e) => e.exerciseId !== exerciseId),
    );
  };

  const updateExercise = (
    exerciseId: string,
    field: keyof WorkoutExerciseData,
    value: string | number,
  ) => {
    setSelectedExercises(
      selectedExercises.map((e) =>
        e.exerciseId === exerciseId ? { ...e, [field]: value } : e,
      ),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/workouts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          exercisesId: selectedExercises,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create workout");
      }

      const newWorkout = await response.json();

      if (newWorkout && newWorkout.id) {
        onWorkoutCreated(newWorkout);
        setFormData({ title: "", description: "" });
        setSelectedExercises([]);
        setOpen(false);
      } else {
        console.error("Invalid workout data received:", newWorkout);
      }
    } catch (error) {
      console.error("Error creating workout", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="text-white">
          <Plus className="h-4 w-4" />
          Adicionar Treino
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto rounded-[8px] bg-gradient-to-br from-black to-[#101010] sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">
            Criar um novo treino
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Preencha os dados do novo treino e adicione os exercícios
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Nome</Label>
              <Input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Ex: Treino de Costa"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                name="description"
                type="text"
                required
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Ex: Um treino voltado a iniciantes..."
              />
            </div>
          </div>

          {/* Exercise Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg">Exercícios</Label>
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={() => setShowExerciseSelector(!showExerciseSelector)}
                className="rounded-[8px] border-2"
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Exercício
              </Button>
            </div>

            {/* Exercise Selector */}
            {showExerciseSelector && (
              <div className="rounded-[8px] border border-white/30 p-4">
                <div className="mb-3">
                  <div className="relative">
                    <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar exercícios..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="max-h-40 space-y-2 overflow-y-auto">
                  {loadingExercises ? (
                    <div className="py-4 text-center text-gray-400">
                      Carregando exercícios...
                    </div>
                  ) : (
                    filteredExercises.map((exercise) => (
                      <div
                        key={exercise.id}
                        className="flex cursor-pointer items-center justify-between rounded-[8px] p-2 hover:bg-white/15"
                        onClick={() => addExercise(exercise)}
                      >
                        <div>
                          <div className="font-medium">{exercise.name}</div>
                          <div className="text-sm text-white/70">
                            {exercise.targetMuscle}
                          </div>
                        </div>
                        <Plus className="h-4 w-4 hover:text-white" />
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Selected Exercises */}
            <div className="space-y-3">
              {selectedExercises.map((exerciseData) => (
                <div
                  key={exerciseData.exerciseId}
                  className="rounded-[8px] border border-white/30 bg-[#0c0c0c] p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">
                        {exerciseData.exercise.name}
                      </h4>
                      <p className="text-sm text-white/70">
                        {exerciseData.exercise.targetMuscle}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeExercise(exerciseData.exerciseId)}
                      className="rounded-[8px] hover:bg-red-600/10 hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                    <div>
                      <Label className="text-xs text-white/80">Séries</Label>
                      <Input
                        type="number"
                        min="1"
                        value={exerciseData.sets}
                        onChange={(e) =>
                          updateExercise(
                            exerciseData.exerciseId,
                            "sets",
                            parseInt(e.target.value),
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-white/80">
                        Repetições
                      </Label>
                      <Input
                        value={exerciseData.reps}
                        onChange={(e) =>
                          updateExercise(
                            exerciseData.exerciseId,
                            "reps",
                            e.target.value,
                          )
                        }
                        placeholder="10-12"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-white/80">Peso</Label>
                      <Input
                        value={exerciseData.weight || ""}
                        onChange={(e) =>
                          updateExercise(
                            exerciseData.exerciseId,
                            "weight",
                            e.target.value,
                          )
                        }
                        placeholder="20kg"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-white/80">Descanso</Label>
                      <Input
                        value={exerciseData.rest || ""}
                        onChange={(e) =>
                          updateExercise(
                            exerciseData.exerciseId,
                            "rest",
                            e.target.value,
                          )
                        }
                        placeholder="60s"
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <Label className="text-xs text-white/80">Observações</Label>
                    <Input
                      value={exerciseData.notes || ""}
                      onChange={(e) =>
                        updateExercise(
                          exerciseData.exerciseId,
                          "notes",
                          e.target.value,
                        )
                      }
                      placeholder="Observações adicionais..."
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-[8px]"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || selectedExercises.length === 0}
              variant="secondary"
              className="flex-1"
            >
              {loading ? "Salvando..." : "Salvar Treino"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
