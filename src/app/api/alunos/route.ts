import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  generateSecurePassword,
  isValidCPF,
  isValidEmail,
  isValidPhone,
} from "@/lib/utils/validations";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

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

    await resend.emails.send({
  from: "Academia Montanini <noreply@montanini.xyz>",
  to: email,
  subject: "🎉 Bem-vindo à Academia Montanini!",
  html: `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                
                <!-- Header -->
                <tr>
                  <td style="background: #1a1a1a; padding: 40px 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🏋️ Academia Montanini</h1>
                    <p style="color: #cccccc; margin: 10px 0 0 0; font-size: 16px;">Seja bem-vindo(a)!</p>
                  </td>
                </tr>
                
                <!-- Body -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 24px;">Olá, ${name}! 👋</h2>
                    
                    <p style="color: #666666; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
                      Estamos muito felizes em tê-lo(a) conosco! Sua conta foi criada com sucesso.
                    </p>
                    
                    <div style="background-color: #f8f9fa; border-left: 4px solid#F8BD01; padding: 20px; margin: 30px 0; border-radius: 5px;">
                      <p style="color: #333333; margin: 0 0 10px 0; font-size: 14px; font-weight: bold;">
                        🔑 Sua senha temporária:
                      </p>
                      <p style="color:#F8BD01; margin: 0; font-size: 24px; font-weight: bold; font-family: 'Courier New', monospace; letter-spacing: 2px;">
                        ${password}
                      </p>
                    </div>
                    
                    <div style="background-color: #fff3cd; border: 1px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px;">
                      <p style="color: #856404; margin: 0; font-size: 14px;">
                        ⚠️ <strong>Importante:</strong> Por segurança, altere sua senha após o primeiro acesso.
                      </p>
                    </div>
                    
                    <p style="color: #666666; line-height: 1.6; margin: 20px 0 0 0; font-size: 16px;">
                      Para acessar, abra o aplicativo e faça login usando seu <strong>email</strong> e a <strong>senha temporária</strong> acima.
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                    <p style="color: #999999; margin: 0 0 10px 0; font-size: 14px;">
                      Precisa de ajuda? Entre em contato conosco!
                    </p>
                    <p style="color: #999999; margin: 0; font-size: 12px;">
                      © ${new Date().getFullYear()} Montanini Academy - Todos os direitos reservados
                    </p>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `,
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
