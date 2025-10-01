import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword } from "@/lib/auth";
import { getCurrentAdmin } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    if (!password) {
      return NextResponse.json(
        { error: "Senha é obrigatória" },
        { status: 400 },
      );
    }

    // Recupera o admin logado
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    // Busca o hash da senha no banco
    const dbAdmin = await prisma.admin.findUnique({
      where: { id: admin.id },
      select: { password: true },
    });
    if (!dbAdmin) {
      return NextResponse.json(
        { error: "Admin não encontrado" },
        { status: 404 },
      );
    }

    // Compara a senha informada com o hash
    const isValid = await comparePassword(password, dbAdmin.password);
    if (!isValid) {
      return NextResponse.json({ valid: false }, { status: 200 });
    }
    return NextResponse.json({ valid: true }, { status: 200 });
  } catch (error) {
    console.error("Erro ao validar senha:", error);
    return NextResponse.json(
      { error: "Erro ao validar senha" },
      { status: 500 },
    );
  }
}
