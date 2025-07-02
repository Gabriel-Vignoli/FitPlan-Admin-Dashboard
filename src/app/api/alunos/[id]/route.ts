import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const aluno = await prisma.student.findUnique({
      where: { id: params.id },
      include: {
        plan: true,
      }
      });

      if (!aluno) {
        return NextResponse.json(
            { error: 'Aluno não encontrado' },
            { status: 404 }
        )
      }

      return NextResponse.json(aluno)
} catch(error) {
    console.log('Error fetching aluno:', error)
    return NextResponse.json(
        { error: 'Falha ao buscar aluno' },
        { status: 500 }
    )
}
}