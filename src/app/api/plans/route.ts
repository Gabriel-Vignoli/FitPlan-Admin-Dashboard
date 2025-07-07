import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const plans = await prisma.plan.findMany({
      orderBy: {
        price: "desc",
      },
    });
    return NextResponse.json(plans);
  } catch (error) {
    console.error("Error fetching plans:", error);
    return NextResponse.json(
      { error: "Erro ao buscar planos" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, price, description, duration } = body;

    // Validations
    if (!name || !price || !description || !duration) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 },
      );
    }

    // Creating the plan
    const newPlan = await prisma.plan.create({
      data: {
        name,
        price,
        description,
        duration
      }
    });

    return NextResponse.json(newPlan, { status: 201 });

  } catch (error) {
    console.error("Error creating plan:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}