import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get("q");

    if (searchQuery && searchQuery.length >= 2) {
      const exercises = await prisma.exercise.findMany({
        where: {
          name: {
            contains: searchQuery,
            mode: "insensitive",
          },
        },
        orderBy: {
          name: "asc",
        },
        take: 15,
      });

      return NextResponse.json(exercises);
    }

    const exercises = await prisma.exercise.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(exercises);
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

    let imageUrl = "";
    let videoUrl = "";

    // Handle image upload
    if (imageFile) {
      const imageBytes = await imageFile.arrayBuffer();
      const imageBuffer = Buffer.from(imageBytes);

      // Generate unique filename
      const imageExtension = path.extname(imageFile.name);
      const imageFileName = `${Date.now()}-${Math.random().toString(36).substring(2)}${imageExtension}`;

      // Create uploads/images directory if it doesn't exist
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      const imagesDir = path.join(uploadsDir, "images");

      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
      }
      if (!existsSync(imagesDir)) {
        await mkdir(imagesDir, { recursive: true });
      }

      // Save to public/uploads/images directory
      const imagePath = path.join(imagesDir, imageFileName);
      await writeFile(imagePath, imageBuffer);

      imageUrl = `/uploads/images/${imageFileName}`;
    }

    // Handle video upload
    if (videoFile) {
      const videoBytes = await videoFile.arrayBuffer();
      const videoBuffer = Buffer.from(videoBytes);

      // Generate unique filename
      const videoExtension = path.extname(videoFile.name);
      const videoFileName = `${Date.now()}-${Math.random().toString(36).substring(2)}${videoExtension}`;

      // Create uploads/videos directory if it doesn't exist
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      const videosDir = path.join(uploadsDir, "videos");

      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
      }
      if (!existsSync(videosDir)) {
        await mkdir(videosDir, { recursive: true });
      }

      // Save to public/uploads/videos directory
      const videoPath = path.join(videosDir, videoFileName);
      await writeFile(videoPath, videoBuffer);

      videoUrl = `/uploads/videos/${videoFileName}`;
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
