'use client'

import { formatDayofWeekToDay } from "@/lib/utils/formatters";
import { useEffect, useState } from "react";

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

export default function AlunoWorkouts({ id, workouts: initialWorkouts }: AlunoWorkoutsProps) {
   const [workouts, setWorkouts] = useState<StudentWorkout[]>(initialWorkouts || [])
   const [loading, setLoading] = useState(false)
   const [error, setError] = useState("")

   // If you want to fetch fresh data from the endpoint
   const fetchStudentWorkouts = async () => {
     setLoading(true)
     setError("")
     
     try {
       const response = await fetch(`/api/alunos/${id}/workouts`)

       if(!response.ok) {
           setError("Treinos não encontrados")
           return
       }  

       const data = await response.json()
       setWorkouts(data)
     } catch (error) {
       console.error("Erro ao carregar treinos:", error);
       setError("Erro ao carregar os treinos do aluno");
     } finally {
       setLoading(false);
     }
   };

   // Use initial workouts but provide option to refresh
   useEffect(() => {
     if (initialWorkouts && initialWorkouts.length > 0) {
       setWorkouts(initialWorkouts)
     } else if (id) {
       // Only fetch if no initial workouts provided
       fetchStudentWorkouts()
     }
   }, [id, initialWorkouts])

   if (loading) {
     return (
       <div className="mt-8 w-full max-w-4xl">
         <h3 className="text-xl font-semibold mb-4">Treinos do Aluno</h3>
         <div className="flex justify-center p-8">
           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
         </div>
       </div>
     )
   }

   if (error) {
     return (
       <div className="mt-8 w-full max-w-4xl">
         <h3 className="text-xl font-semibold mb-4">Treinos do Aluno</h3>
         <div className="rounded-[8px] border border-red-500/30 bg-red-500/10 p-4">
           <p className="text-red-400">{error}</p>
           <button 
             onClick={fetchStudentWorkouts}
             className="mt-2 text-sm text-blue-400 hover:text-blue-300 underline"
           >
             Tentar novamente
           </button>
         </div>
       </div>
     )
   }

   if (!workouts || workouts.length === 0) {
     return (
       <div className="mt-8 w-full max-w-4xl">
         <h3 className="text-xl font-semibold mb-4">Treinos do Aluno</h3>
         <div className="rounded-[8px] border border-yellow-500/30 bg-yellow-500/10 p-4">
           <p className="text-yellow-400">Nenhum treino atribuído a este aluno.</p>
         </div>
       </div>
     )
   }

   return (
     <div className="mt-8 w-full max-w-4xl">
       <div className="flex justify-between items-center mb-4">
         <h3 className="text-xl font-semibold">Treinos do Aluno</h3>
       </div>
       <div className="grid gap-4">
         {workouts
           .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
           .map((studentWorkout) => (
             <div
               key={studentWorkout.id}
               className="border-white/30 border rounded-[8px] p-4 bg-[#060606] shadow-sm"
             >
               <div className="flex justify-between items-start mb-3">
                 <div>
                   <h4 className="font-medium text-lg">
                     {formatDayofWeekToDay(studentWorkout.dayOfWeek)}: {studentWorkout.workout.title}
                   </h4>
                   {studentWorkout.workout.description && (
                     <p className="text-sm text-white/60">
                       {studentWorkout.workout.description}
                     </p>
                   )}
                 </div>
                 <div className="flex items-center gap-2">
                   <span
                     className={`rounded-full px-3 py-1 text-sm font-medium ${
                       studentWorkout.isActive
                         ? "bg-green-500/20 text-green-400"
                         : "bg-red-500/20 text-red-400"
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
                         className="flex items-center justify-between p-3 bg-[#101010] rounded-[8px] hover:bg-[#151515] hover:scale-[1.01] transition"
                       >
                         <div className="flex-1">
                           <span className="font-medium">
                             {workoutExercise.exercise.name}
                           </span>
                           <span className="text-sm text-white/70 ml-2">
                             ({workoutExercise.exercise.targetMuscle})
                           </span>
                         </div>
                         <div className="text-sm text-white/70">
                           {workoutExercise.sets} séries × {workoutExercise.reps} reps
                           {workoutExercise.weight && ` - ${workoutExercise.weight}kg`}
                           {workoutExercise.rest && ` - ${workoutExercise.rest}s`}
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
   )
}