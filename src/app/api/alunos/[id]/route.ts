import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> },) {
  try {
    const { id } = await params;
    const aluno = await prisma.student.findUnique({
      where: { id },
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

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> },) {
  try {
    const body = await request.json();
    const { id } = await params;
    
    const existingStudent = await prisma.student.findUnique({
      where: { id }
    });

    if (!existingStudent) {
      return NextResponse.json(
        { error: 'Aluno não encontrado' },
        { status: 404 }
      );
    }

    const updatedAluno = await prisma.student.update({
      where: { id },
      data: body,
      include: {
        plan: true,
      }
    });

    return NextResponse.json(updatedAluno);

  } catch (error) {
    console.log('Error updating aluno:', error);
    return NextResponse.json(
      { error: 'Falha ao atualizar aluno' },
      { status: 500 }
    );
  }
}