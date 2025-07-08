import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const exercises = await prisma.exercise.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(exercises);
  } catch (error) {
    console.log("Error fetching exercises", error);
    return NextResponse.json(
      { error: "Erro ao buscar exercicios" },
      { status: 500 },
    );
  }
}
