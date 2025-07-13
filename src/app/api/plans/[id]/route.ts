import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const plan = await prisma.plan.findUnique({
      where: { id },
    });

    if (!plan) {
      return NextResponse.json(
        { error: "Plano não encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json(plan);
  } catch (error) {
    console.log("Error fetching plan:", error);
    return NextResponse.json(
      { error: "Falha ao buscar plano" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const body = await request.json();
    const { id } = await params;

    const existingPlan = await prisma.plan.findUnique({
      where: { id },
    });

    if (!existingPlan) {
      return NextResponse.json(
        { error: "Plano não encontrado" },
        { status: 404 },
      );
    }

    const updatedPlan = await prisma.plan.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(updatedPlan);
  } catch (error) {
    console.log("Error updating plan:", error);
    return NextResponse.json(
      { error: "Falha ao atualizar plano" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const existingPlan = await prisma.plan.findUnique({
      where: { id },
    });

    if (!existingPlan) {
      return NextResponse.json(
        { error: "Plano não encontrado" },
        { status: 404 },
      );
    }

    await prisma.plan.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Plano excluído com sucesso" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Erro ao excluir plano:", error);
    return NextResponse.json(
      { error: "Falha ao excluir plano" },
      { status: 500 },
    );
  }
}
