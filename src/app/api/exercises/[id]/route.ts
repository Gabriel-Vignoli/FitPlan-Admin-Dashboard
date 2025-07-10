import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if exercise exists
    const existingExercise = await prisma.exercise.findUnique({
      where: { id },
    });

    if (!existingExercise) {
      return NextResponse.json(
        { error: "Exercício não encontrado" },
        { status: 404 }
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
        { status: 400 }
      );
    }

    let imageUrl = existingExercise.imageUrl;
    let videoUrl = existingExercise.videoUrl;

    // Handle image removal
    if (removeImage && existingExercise.imageUrl) {
      const oldImagePath = path.join(process.cwd(), "public", existingExercise.imageUrl);
      if (existsSync(oldImagePath)) {
        try {
          await unlink(oldImagePath);
        } catch (error) {
          console.warn("Failed to delete old image:", error);
        }
      }
      imageUrl = "";
    }

    // Handle video removal
    if (removeVideo && existingExercise.videoUrl) {
      const oldVideoPath = path.join(process.cwd(), "public", existingExercise.videoUrl);
      if (existsSync(oldVideoPath)) {
        try {
          await unlink(oldVideoPath);
        } catch (error) {
          console.warn("Failed to delete old video:", error);
        }
      }
      videoUrl = "";
    }

    // Handle new image upload
    if (imageFile && imageFile.size > 0) {
      // Delete old image if exists
      if (existingExercise.imageUrl) {
        const oldImagePath = path.join(process.cwd(), "public", existingExercise.imageUrl);
        if (existsSync(oldImagePath)) {
          try {
            await unlink(oldImagePath);
          } catch (error) {
            console.warn("Failed to delete old image:", error);
          }
        }
      }

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

    // Handle new video upload
    if (videoFile && videoFile.size > 0) {
      // Delete old video if exists
      if (existingExercise.videoUrl) {
        const oldVideoPath = path.join(process.cwd(), "public", existingExercise.videoUrl);
        if (existsSync(oldVideoPath)) {
          try {
            await unlink(oldVideoPath);
          } catch (error) {
            console.warn("Failed to delete old video:", error);
          }
        }
      }

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
      { status: 500 }
    );
  }
}