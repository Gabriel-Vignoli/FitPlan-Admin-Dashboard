import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface ExerciseData {
  exerciseId: string;
  sets: number;
  reps: string;
  weight?: string;
  rest?: string;
  notes?: string;
}

interface CreateWorkoutRequest {
  title: string;
  description: string;
  exercisesId?: ExerciseData[];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get("q");
    const page = parseInt(searchParams.get("page") || "1");
    const limit =
      searchParams.get("limit") === "all"
        ? undefined
        : parseInt(searchParams.get("limit") || "10");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const skip = limit ? (page - 1) * limit : 0;

    const whereClause =
      searchQuery && searchQuery.length >= 2
        ? {
            title: {
              contains: searchQuery,
              mode: "insensitive" as const,
            },
          }
        : {};

    const [workouts, totalCount] = await Promise.all([
      prisma.workout.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder as "asc" | "desc",
        },
        include: {
          exercises: {
            include: {
              exercise: true,
            },
            orderBy: { order: "asc" },
          },
        },
      }),
      prisma.workout.count({ where: whereClause }),
    ]);

    const totalPages = limit ? Math.ceil(totalCount / limit) : 1;
    const hasNextPage = limit ? page < totalPages : false;
    const hasPreviousPage = page > 1;

    return NextResponse.json({
      success: true,
      data: {
        workouts,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: totalCount,
          itemsPerPage: limit,
          hasNextPage,
          hasPreviousPage,
        },
        query: {
          search: searchQuery || "",
          sortBy,
          sortOrder,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching workouts:", error);
    return NextResponse.json(
      { error: "Erro ao buscar treinos" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateWorkoutRequest = await request.json();
    const { title, description, exercisesId } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: "Título e descrição são obrigatórios" },
        { status: 400 },
      );
    }

    if (
      exercisesId &&
      (!Array.isArray(exercisesId) || exercisesId.length < 1)
    ) {
      return NextResponse.json(
        {
          error: "Você precisa adicionar pelo menos um exercicio no seu treino",
        },
        { status: 400 },
      );
    }

    const newWorkout = await prisma.workout.create({
      data: {
        title,
        description,
        exercises:
          exercisesId && exercisesId.length > 0
            ? {
                create: exercisesId.map(
                  (exerciseData: ExerciseData, index: number) => ({
                    exerciseId: exerciseData.exerciseId,
                    sets: exerciseData.sets,
                    reps: exerciseData.reps,
                    weight: exerciseData.weight,
                    rest: exerciseData.rest,
                    notes: exerciseData.notes,
                    order: index + 1,
                  }),
                ),
              }
            : undefined,
      },
      include: {
        exercises: {
          include: {
            exercise: true,
          },
          orderBy: { order: "asc" },
        },
      },
    });

    return NextResponse.json(newWorkout, { status: 201 });
  } catch (error) {
    console.error("Error creating workout:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
