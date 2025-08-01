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
import { Plus, X, Search, AlertCircle } from "lucide-react";
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

interface AddWorkoutToAlunoDialogProps {
  onWorkoutAdded: (studentWorkout: StudentWorkout) => void;
  id: string;
}

export default function AddWorkoutToAlunoDialog({
  onWorkoutAdded,
  id,
}: AddWorkoutToAlunoDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingWorkouts, setLoadingWorkouts] = useState(false);
  const [availableWorkouts, setAvailableWorkouts] = useState<Workout[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showWorkoutSelector, setShowWorkoutSelector] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    dayOfWeek: "",
  });

  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

  useEffect(() => {
    if (open && availableWorkouts.length === 0 && !fetchError) {
      fetchWorkouts();
    }
  }, [open, availableWorkouts.length, fetchError]);

  const fetchWorkouts = async () => {
    setLoadingWorkouts(true);
    setFetchError(null);
    try {
      const response = await fetch("/api/workouts");
      if (!response.ok) {
        throw new Error(`Erro ao carregar treinos: ${response.status}`);
      }
      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Formato de dados inválido recebido do servidor");
      }

      setAvailableWorkouts(data);
    } catch (error) {
      console.error("Error fetching workouts:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao carregar treinos";
      setFetchError(errorMessage);
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
      const response = await fetch(`/api/alunos/${id}/workouts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dayOfWeek: dayOfWeekNumber,
          studentId: id,
          workoutId: selectedWorkout?.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error ||
            `Erro ${response.status}: Falha ao adicionar treino ao aluno`,
        );
      }

      const data = await response.json();

      if (!data || !data.id) {
        throw new Error("Resposta inválida do servidor");
      }

      onWorkoutAdded(data);
      setFormData({ dayOfWeek: "" });
      setSelectedWorkout(null);
      setOpen(false);
    } catch (error) {
      console.error("Error adding workout to student", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao adicionar treino";
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

  const handleKeyDown = (e: React.KeyboardEvent, workout: Workout) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      addWorkout(workout);
    }
  };

  const resetDialog = () => {
    setFormData({ dayOfWeek: "" });
    setSelectedWorkout(null);
    setError(null);
    setFetchError(null);
    setSearchTerm("");
    setShowWorkoutSelector(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      resetDialog();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="text-white">
          <Plus className="h-4 w-4" />
          Adicionar Treino
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto rounded-[8px] bg-gradient-to-br from-black to-[#101010] sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">
            Adicionar um treino
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
              <Label htmlFor="dayOfWeek">
                Dia da Semana
              </Label>
              <Select
                value={formData.dayOfWeek}
                onValueChange={handleDayChange}
              >
                <SelectTrigger className="rounded-[8px] border-white/40 w-full">
                  <SelectValue placeholder="Selecione um dia" />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/20">
                  <SelectItem value="Segunda" className="text-white hover:bg-white/10">Segunda</SelectItem>
                  <SelectItem value="Terça" className="text-white hover:bg-white/10">Terça</SelectItem>
                  <SelectItem value="Quarta" className="text-white hover:bg-white/10">Quarta</SelectItem>
                  <SelectItem value="Quinta" className="text-white hover:bg-white/10">Quinta</SelectItem>
                  <SelectItem value="Sexta" className="text-white hover:bg-white/10">Sexta</SelectItem>
                  <SelectItem value="Sabado" className="text-white hover:bg-white/10">Sábado</SelectItem>
                  <SelectItem value="Domingo" className="text-white hover:bg-white/10">Domingo</SelectItem>
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
                  ) : fetchError ? (
                    <div className="py-4 text-center">
                      <div className="mb-2 flex items-center justify-center gap-2 text-red-400">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">{fetchError}</span>
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
                        onKeyDown={(e) => handleKeyDown(e, workout)}
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
                loading || !selectedWorkout || !formData.dayOfWeek.trim()
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