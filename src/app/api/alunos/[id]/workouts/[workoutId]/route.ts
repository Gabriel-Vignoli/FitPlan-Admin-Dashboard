import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface UpdateWorkoutRequest {
  workoutId?: string;
  dayOfWeek?: number;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; workoutId: string }> }
) {
  try {
    const { id: studentId, workoutId: studentWorkoutId } = await params;
    
    if (!studentWorkoutId) {
      return NextResponse.json(
        { error: "ID do treino do aluno é obrigatório" },
        { status: 400 }
      );
    }

    const body: UpdateWorkoutRequest = await request.json();
    const { workoutId: newWorkoutId, dayOfWeek } = body;

    if (!newWorkoutId && !dayOfWeek) {
      return NextResponse.json(
        { error: "Pelo menos um dos campos deve ser informado" },
        { status: 400 }
      );
    }

    if (dayOfWeek && (dayOfWeek < 1 || dayOfWeek > 7)) {
      return NextResponse.json(
        { error: "O dia da semana deve estar entre 1 e 7" },
        { status: 400 }
      );
    }
    const existingStudentWorkout = await prisma.studentWorkout.findUnique({
      where: { id: studentWorkoutId },
      include: {
        workout: true
      }
    });

    if (!existingStudentWorkout) {
      return NextResponse.json(
        { error: "Treino do aluno não encontrado" },
        { status: 404 }
      );
    }

    if (existingStudentWorkout.studentId !== studentId) {
      return NextResponse.json(
        { error: "Este treino não pertence ao aluno informado" },
        { status: 403 }
      );
    }

    if (newWorkoutId && newWorkoutId !== existingStudentWorkout.workoutId) {
      const workoutExists = await prisma.workout.findUnique({
        where: { id: newWorkoutId }
      });

      if (!workoutExists) {
        return NextResponse.json(
          { error: "Novo treino não encontrado" },
          { status: 404 }
        );
      }
    }
  
    const updateData: { workoutId?: string; dayOfWeek?: number } = {};
    
    if (newWorkoutId) {
      updateData.workoutId = newWorkoutId;
    }
    
    if (dayOfWeek) {
      updateData.dayOfWeek = dayOfWeek;
    }

    // Update the student workout
    const updatedStudentWorkout = await prisma.studentWorkout.update({
      where: { id: studentWorkoutId },
      data: updateData,
      include: {
        workout: {
          include: {
            exercises: {
              orderBy: {
                order: 'asc'
              },
              include: {
                exercise: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json(updatedStudentWorkout);

  } catch (error) {
    console.error("Error updating student workout:", error);
    
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; workoutId: string }> }
) {
  try {
    const { id: studentId, workoutId: studentWorkoutId } = await params;
    if (!studentWorkoutId) {
      return NextResponse.json(
        { error: "ID do treino do aluno é obrigatório" },
        { status: 400 }
      );
    }
    const existingStudentWorkout = await prisma.studentWorkout.findUnique({
      where: { id: studentWorkoutId }
    });
    if (!existingStudentWorkout) {
      return NextResponse.json(
        { error: "Treino do aluno não encontrado" },
        { status: 404 }
      );
    }
    if (existingStudentWorkout.studentId !== studentId) {
      return NextResponse.json(
        { error: "Este treino não pertence ao aluno informado" },
        { status: 403 }
      );
    }
    await prisma.studentWorkout.delete({
      where: { id: studentWorkoutId }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao excluir treino do aluno:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}