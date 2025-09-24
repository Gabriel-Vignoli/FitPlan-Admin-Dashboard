import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  generateSecurePassword,
  isValidCPF,
  isValidEmail,
  isValidPhone,
} from "@/lib/utils/validations";
// import { Resend } from "resend";
// const resend = new Resend(process.env.RESEND_API_KEY);

// Find all users or search by name with pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get("q");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const skip = (page - 1) * limit;

    if (searchQuery && searchQuery.length >= 2) {
      const whereClause = {
        name: {
          contains: searchQuery,
          mode: "insensitive" as const,
        },
      };

      const [students, totalCount] = await Promise.all([
        prisma.student.findMany({
          where: whereClause,
          skip,
          take: limit,
          select: {
            id: true,
            name: true,
            phone: true,
            avatar: true,
            createdAt: true,
            paymentStatus: true,
            plan: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            [sortBy]: sortOrder as "asc" | "desc",
          },
        }),
        prisma.student.count({
          where: whereClause,
        }),
      ]);

      const totalPages = Math.ceil(totalCount / limit);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      return NextResponse.json({
        success: true,
        data: {
          alunos: students,
          pagination: {
            currentPage: page,
            totalPages,
            totalItems: totalCount,
            itemsPerPage: limit,
            hasNextPage,
            hasPreviousPage,
          },
          query: {
            search: searchQuery,
            sortBy,
            sortOrder,
          },
        },
      });
    }

    // If no search query, return all students with pagination
    const [alunos, totalCount] = await Promise.all([
      prisma.student.findMany({
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder as "asc" | "desc",
        },
        select: {
          id: true,
          name: true,
          phone: true,
          avatar: true,
          createdAt: true,
          paymentStatus: true,
          plan: {
            select: {
              name: true,
            },
          },
        },
      }),
      prisma.student.count(),
    ]);

    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return NextResponse.json({
      success: true,
      data: {
        alunos,
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
    console.error("Error fetching alunos:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch alunos",
      },
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

    // await resend.emails.send({
    //   from: "Academia <onboarding@resend.dev>",
    //   to: email,
    //   subject: "Sua senha de acesso",
    //   html: `<p>Olá ${name},</p>
    //      <p>Bem-vindo! Sua senha de acesso é: <strong>${password}</strong></p>
    //      <p>Por favor, altere sua senha após o primeiro acesso.</p>`,
    // });

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
