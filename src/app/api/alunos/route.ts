import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  generateSecurePassword,
  isValidCPF,
  isValidEmail,
  isValidPhone,
} from "@/lib/utils/validations";

// Find all users or search by name
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get("q");

    // If there's a search query, perform search
    if (searchQuery && searchQuery.length >= 2) {
      const students = await prisma.student.findMany({
        where: {
          name: {
            contains: searchQuery,
            mode: "insensitive",
          },
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          isActive: true,
        },
        orderBy: {
          name: "asc",
        },
        take: 10,
      });

      return NextResponse.json(students);
    }

    // If no search query, return all students
    const alunos = await prisma.student.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        phone: true,
        createdAt: true,
        paymentStatus: true,
        plan: {
          select: {
            name: true
          }
        }
      }
    });

    return NextResponse.json(alunos);
  } catch (error) {
    console.error("Error fetching alunos:", error);
    return NextResponse.json(
      { error: "Failed to fetch alunos" },
      { status: 500 },
    );
  }
}

// Create one User
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, birthDate, cpf, planId } = body;

    // Validation
    if (!name || !email || !phone || !birthDate || !cpf || !planId) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 },
      );
    }

    // Check if the user already exists
    const existingUser = await prisma.student.findUnique({
      where: { email },
    });
    if (existingUser) {
      return NextResponse.json(
        { error: "Já há um usuário com esse email" },
        { status: 409 },
      );
    }

    // Check if the email is valid
    const emailValidation = isValidEmail(email);
    if (!emailValidation) {
      return NextResponse.json(
        { error: "Insira um email válido" },
        { status: 400 },
      );
    }

    // Check if the phone number is valid
    const phoneValidation = isValidPhone(phone);
    if (!phoneValidation) {
      return NextResponse.json(
        { error: "Insira um número válido" },
        { status: 400 },
      );
    }

    // Check if the cpf is valid
    const cpfValidation = isValidCPF(cpf);
    if (!cpfValidation) {
      return NextResponse.json(
        { error: "Insira um CPF válido " },
        { status: 400 },
      );
    }

    // Check if the plan exists
    const existingPlan = await prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!existingPlan) {
      return NextResponse.json(
        { error: "Plano não encontrado" },
        { status: 404 },
      );
    }

    const password = generateSecurePassword();

    // Creating a new user
    await prisma.student.create({
      data: {
        name,
        email,
        phone,
        birthDate: new Date(birthDate),
        password: password, 
        cpf,
        planId,
      },
    });

    return NextResponse.json(
      { message: "Usuário criado com sucesso" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}