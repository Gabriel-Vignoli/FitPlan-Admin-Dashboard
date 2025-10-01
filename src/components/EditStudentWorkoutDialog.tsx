"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import { Plus, X, Search, AlertCircle, Edit } from "lucide-react";
import { Label } from "./ui/label";
import { formatDayToNumber } from "@/lib/utils/formatters";

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

interface EditStudentWorkoutDialogProps {
  onWorkoutUpdated: (updatedStudentWorkout: StudentWorkout) => void;
  studentWorkout: StudentWorkout;
}

const formatNumberToDay = (dayNumber: number): string => {
  const days = [
    "",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sabado",
    "Domingo",
  ];
  return days[dayNumber] || "";
};

export default function EditStudentWorkoutDialog({
  onWorkoutUpdated,
  studentWorkout,
}: EditStudentWorkoutDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingWorkouts, setLoadingWorkouts] = useState(false);
  const [availableWorkouts, setAvailableWorkouts] = useState<Workout[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showWorkoutSelector, setShowWorkoutSelector] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const [formData, setFormData] = useState({
    dayOfWeek: formatNumberToDay(studentWorkout.dayOfWeek),
  });

  const [originalData, setOriginalData] = useState({
    dayOfWeek: formatNumberToDay(studentWorkout.dayOfWeek),
    workoutId: studentWorkout.workoutId,
  });

  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

  useEffect(() => {
    if (open) {
      const initialDay = formatNumberToDay(studentWorkout.dayOfWeek);
      setFormData({
        dayOfWeek: initialDay,
      });
      setOriginalData({
        dayOfWeek: initialDay,
        workoutId: studentWorkout.workoutId,
      });
      setSelectedWorkout(studentWorkout.workout);
      setError(null);
      setHasChanges(false);
    }
  }, [open, studentWorkout]);

  // Detect changes
  useEffect(() => {
    const dayChanged = formData.dayOfWeek !== originalData.dayOfWeek;
    const workoutChanged = selectedWorkout?.id !== originalData.workoutId;

    setHasChanges(dayChanged || workoutChanged);
  }, [formData.dayOfWeek, selectedWorkout, originalData]);

  useEffect(() => {
    if (open && availableWorkouts.length === 0) {
      fetchWorkouts();
    }
  }, [open]);

  const fetchWorkouts = async () => {
    setLoadingWorkouts(true);
    try {
      const response = await fetch("/api/workouts?limit=all");
      if (!response.ok) {
        throw new Error(`Erro ao carregar treinos: ${response.status}`);
      }
      const data = await response.json();
      let workouts: Workout[] = [];
      if (Array.isArray(data)) {
        workouts = data;
      } else if (data && data.data && Array.isArray(data.data.workouts)) {
        workouts = data.data.workouts;
      } else {
        throw new Error("Formato de dados inválido recebido do servidor");
      }
      setAvailableWorkouts(workouts);
    } catch (error) {
      console.error("Error fetching workouts:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao carregar treinos";
      setError(errorMessage);
    } finally {
      setLoadingWorkouts(false);
    }
  };

  const filteredWorkouts = availableWorkouts.filter(
    (workout) =>
      workout.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (workout.description &&
        workout.description.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const addWorkout = (workout: Workout) => {
    setSelectedWorkout(workout);
    setShowWorkoutSelector(false);
    setSearchTerm("");
    setError(null);
  };

  const removeWorkout = () => {
    setSelectedWorkout(null);
    setError(null);
  };

  const validateForm = (): boolean => {
    if (!formData.dayOfWeek.trim()) {
      setError("Por favor, selecione um dia da semana");
      return false;
    }

    const dayNumber = formatDayToNumber(formData.dayOfWeek);
    if (dayNumber === 0) {
      setError(
        "Dia da semana inválido. Use: Segunda, Terça, Quarta, Quinta, Sexta, Sabado, ou Domingo",
      );
      return false;
    }

    if (!selectedWorkout) {
      setError("Por favor, selecione um treino");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    const dayOfWeekNumber = formatDayToNumber(formData.dayOfWeek);

    if (dayOfWeekNumber === 0) {
      setError(
        "Dia da semana inválido. Use: Segunda, Terça, Quarta, Quinta, Sexta, Sabado, ou Domingo",
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `/api/alunos/${studentWorkout.studentId}/workouts/${studentWorkout.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dayOfWeek: dayOfWeekNumber,
            workoutId: selectedWorkout?.id,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error ||
            `Erro ${response.status}: Falha ao atualizar o treino do aluno`,
        );
      }

      const data = await response.json();

      if (!data || !data.id) {
        throw new Error("Resposta inválida do servidor");
      }

      onWorkoutUpdated(data);
      setOpen(false);
    } catch (error) {
      console.error("Error updating workout:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao atualizar treino";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDayChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      dayOfWeek: value, 
    }));

    if (error) {
      setError(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="rounded-[4px] bg-white/10 p-2 text-white/70 transition-colors hover:bg-blue-500/30 hover:text-blue-500">
          <Edit className="h-4 w-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto rounded-[8px] bg-gradient-to-br from-black to-[#101010] sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">
            Atualizar treino
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Selecione o treino e o dia da semana
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Display */}
          {error && (
            <div className="flex items-center gap-2 rounded-[8px] border border-red-500/50 bg-red-500/10 p-3 text-red-400">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dayOfWeek">Dia da Semana</Label>
              <Select
                value={formData.dayOfWeek}
                onValueChange={handleDayChange}
              >
                <SelectTrigger className="w-full rounded-[8px] border-white/40">
                  <SelectValue placeholder="Selecione um dia" />
                </SelectTrigger>
                <SelectContent className="border-white/20 bg-black">
                  <SelectItem
                    value="Segunda"
                    className="text-white hover:bg-white/10"
                  >
                    Segunda
                  </SelectItem>
                  <SelectItem
                    value="Terça"
                    className="text-white hover:bg-white/10"
                  >
                    Terça
                  </SelectItem>
                  <SelectItem
                    value="Quarta"
                    className="text-white hover:bg-white/10"
                  >
                    Quarta
                  </SelectItem>
                  <SelectItem
                    value="Quinta"
                    className="text-white hover:bg-white/10"
                  >
                    Quinta
                  </SelectItem>
                  <SelectItem
                    value="Sexta"
                    className="text-white hover:bg-white/10"
                  >
                    Sexta
                  </SelectItem>
                  <SelectItem
                    value="Sabado"
                    className="text-white hover:bg-white/10"
                  >
                    Sábado
                  </SelectItem>
                  <SelectItem
                    value="Domingo"
                    className="text-white hover:bg-white/10"
                  >
                    Domingo
                  </SelectItem>
                </SelectContent>
              </Select>
              <p id="dayOfWeek-help" className="text-xs text-white/70">
                Selecione o dia da semana para este treino
              </p>
            </div>
          </div>

          {/* Workout Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg text-white">Treinos</Label>
              <Button
                type="button"
                variant={showWorkoutSelector ? "outline" : "default"}
                size="sm"
                onClick={() => setShowWorkoutSelector(!showWorkoutSelector)}
                className="rounded-[8px] border-2"
                disabled={loadingWorkouts}
              >
                <Plus className="mr-2 h-4 w-4" />
                {showWorkoutSelector ? "Fechar" : "Selecionar Treino"}
              </Button>
            </div>

            {/* Workout Selector */}
            {showWorkoutSelector && (
              <div className="rounded-[8px] border border-white/30 p-4">
                <div className="mb-3">
                  <div className="relative">
                    <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar treinos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full rounded-[8px] border border-white/20 bg-white/5 p-2 pl-10 text-white placeholder:text-gray-500 focus:border-white/40 focus:outline-none"
                      aria-label="Buscar treinos"
                    />
                  </div>
                </div>

                <div className="max-h-40 space-y-2 overflow-y-auto">
                  {loadingWorkouts ? (
                    <div className="py-4 text-center text-gray-400">
                      <div className="animate-pulse">Carregando treinos...</div>
                    </div>
                  ) : error ? (
                    <div className="py-4 text-center">
                      <div className="mb-2 flex items-center justify-center gap-2 text-red-400">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">{error}</span>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={fetchWorkouts}
                        className="text-xs"
                      >
                        Tentar novamente
                      </Button>
                    </div>
                  ) : filteredWorkouts.length === 0 ? (
                    <div className="py-4 text-center text-gray-400">
                      {searchTerm
                        ? "Nenhum treino encontrado"
                        : "Nenhum treino disponível"}
                    </div>
                  ) : (
                    filteredWorkouts.map((workout) => (
                      <div
                        key={workout.id}
                        className="flex cursor-pointer items-center justify-between rounded-[8px] p-2 hover:bg-white/15 focus:bg-white/15 focus:outline-none"
                        onClick={() => addWorkout(workout)}
                        tabIndex={0}
                        role="button"
                        aria-label={`Selecionar treino ${workout.title}`}
                      >
                        <div>
                          <div className="font-medium text-white">
                            {workout.title}
                          </div>
                          {workout.description && (
                            <div className="text-sm text-white/70">
                              {workout.description}
                            </div>
                          )}
                        </div>
                        <Plus className="h-4 w-4 text-gray-400 hover:text-white" />
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Selected Workout */}
            {selectedWorkout && (
              <div className="space-y-3">
                <div className="rounded-[8px] border border-white/30 bg-[#0c0c0c] p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-white">
                        {selectedWorkout.title}
                      </h4>
                      {selectedWorkout.description && (
                        <p className="text-sm text-white/70">
                          {selectedWorkout.description}
                        </p>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeWorkout}
                      className="rounded-[8px] hover:bg-red-600/10 hover:text-red-600"
                      aria-label="Remover treino selecionado"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-[8px]"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={
                loading || !selectedWorkout || !formData.dayOfWeek.trim() || !hasChanges
              }
              variant="secondary"
              className="flex-1 rounded-[8px]"
            >
              {loading ? "Salvando..." : "Salvar Treino"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}