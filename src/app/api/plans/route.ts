import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const plans = await prisma.plan.findMany({
            orderBy: {
                price: "desc"
            }
        })
        return NextResponse.json(plans);
    }
    catch (error) {
    console.error("Error fetching alunos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar planos" },
      { status: 500 },
    );
  }
}