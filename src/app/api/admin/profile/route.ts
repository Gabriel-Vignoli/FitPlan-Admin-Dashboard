import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import s3Client from "../../../../../config/aws";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    // Verify and decode the token
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

  
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.id },
    });

    if (!admin) {
      return NextResponse.json(
        { error: "Admin não encontrado" },
        { status: 404 },
      );
    }

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const prevPassword = formData.get("prevPassword") as string | undefined;
    const newPassword = formData.get("newPassword") as string | undefined;
    const confirmPassword = formData.get("confirmPassword") as
      | string
      | undefined;
    const avatarFile = formData.get("avatar") as File | null;
    let avatarUrl = admin.avatar;

    // Upload avatar to S3 if provided
    if (avatarFile) {
      const ext = avatarFile.name.split(".").pop();
      const fileName = `${Date.now()}-${uuidv4()}.${ext}`;
      const fileBody = new Uint8Array(await avatarFile.arrayBuffer());
      const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: `uploads/images/${fileName}`,
        Body: fileBody,
        ContentType: avatarFile.type ?? undefined,
      };
      const command = new PutObjectCommand(uploadParams);
      await s3Client.send(command);
      avatarUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/uploads/images/${fileName}`;
    }

    let hashedPassword;
    let needsReauth = false;

    // Check if password or email changed
    if (prevPassword && newPassword && confirmPassword) {
      if (newPassword !== confirmPassword) {
        return NextResponse.json(
          { error: "Nova senha e confirmação não coincidem" },
          { status: 400 },
        );
      }
      // Validate previous password
      const { comparePassword, hashPassword } = await import("@/lib/auth");
      const isPrevValid = await comparePassword(prevPassword, admin.password);
      if (!isPrevValid) {
        return NextResponse.json(
          { error: "Senha atual incorreta" },
          { status: 401 },
        );
      }
      hashedPassword = await hashPassword(newPassword);
      needsReauth = true;
    }

    if (email !== admin.email) {
      needsReauth = true; 
    }

    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        name,
        email,
        avatar: avatarUrl,
        ...(hashedPassword ? { password: hashedPassword } : {}),
      },
    });

    if (needsReauth) {
      cookieStore.delete("auth-token");
      return NextResponse.json({ 
        success: true, 
        needsReauth: true,
        message: "Perfil atualizado. Por favor, faça login novamente com suas novas credenciais."
      });
    }

    return NextResponse.json({ success: true, needsReauth: false });
  } catch (error) {
    console.error("Erro ao atualizar perfil do admin:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}