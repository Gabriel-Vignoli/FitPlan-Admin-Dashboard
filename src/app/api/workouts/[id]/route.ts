import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface ExerciseData {
  exerciseId: string;
  sets: number;
  reps: string;
  weight?: string;
  rest?: string;
  notes?: string;
}

interface UpdateWorkoutRequest {
  title?: string;
  description?: string;
  exercises?: ExerciseData[];
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body: UpdateWorkoutRequest = await request.json();
    const { title, description, exercises } = body;
    const { id } = await params;

    const existingWorkout = await prisma.workout.findUnique({
      where: { id },
    });

    if (!existingWorkout) {
      return NextResponse.json(
        { error: "Treino não encontrado" },
        { status: 404 }
      );
    }

    if (exercises && exercises.length < 1) {
      return NextResponse.json(
        { error: "Você precisa adicionar pelo menos um exercício no seu treino" },
        { status: 400 }
      );
    }

    const updatedWorkout = await prisma.$transaction(async (tx) => {
        // It will update the title or the description
      await tx.workout.update({
        where: { id },
        data: {
          ...(title && { title }),
          ...(description !== undefined && { description }),
        },
      });

      if (exercises) {
        // It will delete the old exercises
        await tx.workoutExercise.deleteMany({
          where: { workoutId: id },
        });

        // Create new exercises
        await tx.workoutExercise.createMany({
          data: exercises.map((exercise, index) => ({
            workoutId: id,
            exerciseId: exercise.exerciseId,
            sets: exercise.sets,
            reps: exercise.reps,
            weight: exercise.weight,
            rest: exercise.rest,
            notes: exercise.notes,
            order: index + 1,
          })),
        });
      }

      return await tx.workout.findUnique({
        where: { id },
        include: {
          exercises: {
            include: {
              exercise: true,
            },
            orderBy: { order: "asc" },
          },
        },
      });
    });

    return NextResponse.json(updatedWorkout, { status: 200 });
  } catch (error) {
    console.error("Error updating workout:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}