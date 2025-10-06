import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import s3Client from "../../../../../config/aws";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const existingExercise = await prisma.exercise.findUnique({
      where: { id },
    });

    if (!existingExercise) {
      return NextResponse.json(
        { error: "Exercício não encontrado" },
        { status: 404 },
      );
    }

    const formData = await request.formData();

    const name = formData.get("name") as string;
    const targetMuscle = formData.get("targetMuscle") as string;
    const imageFile = formData.get("image") as File | null;
    const videoFile = formData.get("video") as File | null;
    const removeImage = formData.get("removeImage") === "true";
    const removeVideo = formData.get("removeVideo") === "true";

    if (!name || !targetMuscle) {
      return NextResponse.json(
        { error: "Nome e músculo alvo são obrigatórios" },
        { status: 400 },
      );
    }

    let imageUrl = existingExercise.imageUrl;
    let videoUrl = existingExercise.videoUrl;

    // Helper to convert File to Uint8Array
    async function fileToUint8Array(file: File): Promise<Uint8Array> {
      const arrayBuffer = await file.arrayBuffer();
      return new Uint8Array(arrayBuffer);
    }

    // Handle image removal (just clear URL)
    if (removeImage && existingExercise.imageUrl) {
      imageUrl = "";
    }

    // Handle video removal (just clear URL)
    if (removeVideo && existingExercise.videoUrl) {
      videoUrl = "";
    }

    // Handle new image upload to S3
    if (imageFile && imageFile.size > 0) {
      const imageExtension = imageFile.name.split(".").pop();
      const imageFileName = `${Date.now()}-${uuidv4()}.${imageExtension}`;
      const imageBody = await fileToUint8Array(imageFile);

      const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: `uploads/${imageFileName}`,
        Body: imageBody,
        ContentType: imageFile.type ?? undefined,
      };
      const command = new PutObjectCommand(uploadParams);
      await s3Client.send(command);
      imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/uploads/${imageFileName}`;
    }

    // Handle new video upload to S3
    if (videoFile && videoFile.size > 0) {
      const videoExtension = videoFile.name.split(".").pop();
      const videoFileName = `${Date.now()}-${uuidv4()}.${videoExtension}`;
      const videoBody = await fileToUint8Array(videoFile);

      const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: `uploads/${videoFileName}`,
        Body: videoBody,
        ContentType: videoFile.type ?? undefined,
      };
      const command = new PutObjectCommand(uploadParams);
      await s3Client.send(command);
      videoUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/uploads/${videoFileName}`;
    }

    const updatedExercise = await prisma.exercise.update({
      where: { id },
      data: {
        name,
        targetMuscle,
        imageUrl,
        videoUrl,
      },
    });

    return NextResponse.json(updatedExercise);
  } catch (error) {
    console.error("Error updating exercise:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
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

    const existingExercise = await prisma.exercise.findUnique({
      where: { id },
    });

    if (!existingExercise) {
      return NextResponse.json(
        { error: "Exercicio não encontrado" },
        { status: 404 },
      );
    }

    await prisma.exercise.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Exercicio excluído com sucesso" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Erro ao excluir exercicio:", error);
    return NextResponse.json(
      { error: "Falha ao excluir exercicio" },
      { status: 500 },
    );
  }
}
