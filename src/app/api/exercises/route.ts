import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import s3Client from "../../../../config/aws";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get("q");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = searchParams.get("limit") === "all" 
      ? undefined 
      : parseInt(searchParams.get("limit") || "10");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const skip = limit ? (page - 1) * limit : 0;

    const whereClause =
      searchQuery && searchQuery.length >= 2
        ? {
            name: {
              contains: searchQuery,
              mode: "insensitive" as const,
            },
          }
        : {};

    const [exercises, totalCount] = await Promise.all([
      prisma.exercise.findMany({
        where: whereClause,
        skip: limit ? skip : undefined,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder as "asc" | "desc",
        },
      }),
      prisma.exercise.count({ where: whereClause }),
    ]);

    const totalPages = limit ? Math.ceil(totalCount / limit) : 1;
    const hasNextPage = limit ? page < totalPages : false;
    const hasPreviousPage = page > 1;

    return NextResponse.json({
      success: true,
      data: {
        exercises,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: totalCount,
          itemsPerPage: limit || totalCount,
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
    console.log("Error fetching exercises", error);
    return NextResponse.json(
      { error: "Erro ao buscar exercicios" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const targetMuscle = formData.get("targetMuscle") as string;
    const imageFile = formData.get("image") as File | null;
    const videoFile = formData.get("video") as File | null;

    if (!name || !targetMuscle) {
      return NextResponse.json(
        { error: "Nome e músculo alvo são obrigatórios" },
        { status: 400 },
      );
    }

    // Validate image format - 
    if (imageFile) {
      // Only allow these specific MIME types
      const allowedImageTypes = [
        "image/jpeg",
        "image/pjpeg", 
        "image/png",
        "image/x-png"
      ];
      
      // Only allow these specific extensions
      const allowedExtensions = ["jpg", "jpeg", "png", "jfif"];
      
      const fileExtension = imageFile.name.split(".").pop()?.toLowerCase();
      
      if (!allowedImageTypes.includes(imageFile.type)) {
        return NextResponse.json(
          { error: "Formato de imagem inválido. Apenas JPEG, PNG e JFIF são permitidos." },
          { status: 400 },
        );
      }
      
      if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        return NextResponse.json(
          { error: "Formato de imagem inválido. Apenas JPEG, PNG e JFIF são permitidos." },
          { status: 400 },
        );
      }

      if (imageFile.type === "image/gif" || fileExtension === "gif") {
        return NextResponse.json(
          { error: "GIFs não são permitidos. Apenas JPEG, PNG e JFIF são permitidos." },
          { status: 400 },
        );
      }

      if (imageFile.type === "image/webp" || fileExtension === "webp") {
        return NextResponse.json(
          { error: "WebP não é permitido. Apenas JPEG, PNG e JFIF são permitidos." },
          { status: 400 },
        );
      }
    }

    let imageUrl = "";
    let videoUrl = "";

    // Helper to convert File to Uint8Array
    async function fileToUint8Array(file: File): Promise<Uint8Array> {
      const arrayBuffer = await file.arrayBuffer();
      return new Uint8Array(arrayBuffer);
    }

    // Handle image upload to S3
    if (imageFile) {
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
      imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/avatars/${imageFileName}`;
    }

    // Handle video upload to S3
    if (videoFile) {
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

    const newExercise = await prisma.exercise.create({
      data: {
        name,
        targetMuscle,
        imageUrl,
        videoUrl,
      },
    });

    return NextResponse.json(newExercise, { status: 201 });
  } catch (error) {
    console.error("Error creating exercise:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}