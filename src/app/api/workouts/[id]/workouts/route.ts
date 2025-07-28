import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface AssignWorkoutRequest {
  workoutId: string;
  dayOfWeek: number;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: studentId } = await params;
    const body: AssignWorkoutRequest = await request.json();
    const { workoutId, dayOfWeek } = body;

    if (!workoutId || !dayOfWeek) {
      return NextResponse.json(
        { error: "O aluno e dia da semana são obrigatórios" },
        { status: 400 }
      );
    }

    if (dayOfWeek < 1 || dayOfWeek > 7) {
      return NextResponse.json(
        { error: "O dia da semana deve estar entre 1 e 7" },
        { status: 400 }
      );
    }

    const studentExists = await prisma.student.findUnique({
      where: { id: studentId }
    });

    if (!studentExists) {
      return NextResponse.json(
        { error: "Aluno não encontrado" },
        { status: 404 }
      );
    }

    const workoutExists = await prisma.workout.findUnique({
      where: { id: workoutId }
    });

    if (!workoutExists) {
      return NextResponse.json(
        { error: "Treino não encontrado" },
        { status: 404 }
      );
    }

    // Check if this combination already exists
    const existingAssignment = await prisma.studentWorkout.findUnique({
      where: {
        studentId_workoutId_dayOfWeek: {
          studentId,
          workoutId,
          dayOfWeek
        }
      }
    });

    if (existingAssignment) {
      return NextResponse.json(
        { error: "Este treino já está atribuído ao aluno neste dia da semana" },
        { status: 409 }
      );
    }

    const studentWorkout = await prisma.studentWorkout.create({
      data: {
        studentId,
        workoutId,
        dayOfWeek,
        isActive: true
      },
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

    return NextResponse.json(studentWorkout, { status: 201 });

  } catch (error) {
    console.error("Error assigning workout to student:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: studentId } = await params;

    const studentExists = await prisma.student.findUnique({
      where: { id: studentId }
    });

    if (!studentExists) {
      return NextResponse.json(
        { error: "Aluno não encontrado" },
        { status: 404 }
      );
    }

    const studentWorkouts = await prisma.studentWorkout.findMany({
      where: {
        studentId,
        isActive: true
      },
      orderBy: {
        dayOfWeek: 'asc'
      },
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

    return NextResponse.json(studentWorkouts);

  } catch (error) {
    console.error("Error fetching student workouts:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}