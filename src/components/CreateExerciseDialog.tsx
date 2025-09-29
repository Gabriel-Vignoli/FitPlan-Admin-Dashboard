"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Plus, Upload, X, Image as ImageIcon, Video } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

interface Exercise {
  id: string;
  name: string;
  targetMuscle: string;
  imageUrl: string;
  videoUrl: string;
}

interface CreateExerciseDialogProps {
  onExerciseCreated: (exercise: Exercise) => void;
}

export default function CreateExerciseDialog({
  onExerciseCreated,
}: CreateExerciseDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    targetMuscle: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("targetMuscle", formData.targetMuscle);

      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      if (videoFile) {
        formDataToSend.append("video", videoFile);
      }

      const response = await fetch("/api/exercises", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("Failed to create exercise");
      }

      const newExercise = await response.json();

      if (newExercise && newExercise.id) {
        onExerciseCreated(newExercise);
        resetForm();
        setOpen(false);
      } else {
        throw new Error("Invalid exercise data received");
      }
    } catch (error) {
      console.error("Error creating exercise:", error);
      setError("Erro ao criar exercício. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", targetMuscle: "" });
    setImageFile(null);
    setVideoFile(null);
    setImagePreview(null);
    setError(null);
    setImageError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate image format by extension and MIME type
      const allowedExtensions = ["jpg", "jpeg", "png", "jfif"];
      const allowedTypes = [
        "image/jpeg",
        "image/pjpeg",
        "image/png",
        "image/x-png",
        "image/jfif"
      ];
      const fileExtension = file.name.split(".").pop()?.toLowerCase();

    
      if (
        !fileExtension ||
        !allowedExtensions.includes(fileExtension) ||
        !allowedTypes.includes(file.type)
      ) {
        setImageError(
          "Formato de imagem inválido. Apenas JPEG, PNG e JFIF são permitidos.",
        );
        setImageFile(null);
        setImagePreview(null);
        e.target.value = "";
        return;
      }

      setImageError(null);
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setImageError(null);
  };

  const removeVideo = () => {
    setVideoFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="text-white">
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Exercício
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-[8px] bg-gradient-to-br from-black to-[#101010] sm:max-w-[500px]">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-semibold text-white">
            Criar Novo Exercício
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Preencha os dados do novo exercício e adicione arquivos de mídia.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 backdrop-blur-sm">
              <p className="flex items-center text-sm text-red-400">
                <X className="mr-2 h-4 w-4" />
                {error}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-white">
                Nome do Exercício
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="border-white/20 bg-white/5 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
                placeholder="Supino Reto"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="targetMuscle"
                className="text-sm font-medium text-white"
              >
                Músculo Alvo
              </Label>
              <Input
                id="targetMuscle"
                name="targetMuscle"
                type="text"
                required
                value={formData.targetMuscle}
                onChange={handleInputChange}
                className="border-white/20 bg-white/5 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
                placeholder="Peito"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-3">
              <Label className="flex items-center text-sm font-medium text-white">
                <ImageIcon className="mr-2 h-4 w-4" />
                Imagem do Exercício
              </Label>

              {imageError && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 backdrop-blur-sm">
                  <p className="flex items-center text-sm text-red-400">
                    <X className="mr-2 h-4 w-4" />
                    {imageError}
                  </p>
                </div>
              )}

              {imagePreview ? (
                <div className="relative">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={500}
                    height={128}
                    className="h-32 w-full rounded-lg border border-white/20 object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 h-8 w-8 p-0"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="relative">
                  <Input
                    type="file"
                    accept="image/jpeg,image/png,image/jfif"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <Label
                    htmlFor="image-upload"
                    className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-white/20 bg-white/5 hover:bg-white/10"
                  >
                    <Upload className="mb-2 h-8 w-8 text-gray-400" />
                    <p className="text-sm text-gray-400">
                      Clique para selecionar uma imagem
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      JPEG, PNG ou JFIF
                    </p>
                  </Label>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Label className="flex items-center text-sm font-medium text-white">
                <Video className="mr-2 h-4 w-4" />
                Vídeo do Exercício
              </Label>

              {videoFile ? (
                <div className="flex items-center justify-between rounded-lg border border-white/20 bg-white/5 p-3">
                  <div className="flex items-center space-x-3">
                    <Video className="h-5 w-5 text-blue-400" />
                    <div>
                      <p className="text-sm font-medium text-white">
                        {videoFile.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeVideo}
                    className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="relative">
                  <Input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="hidden"
                    id="video-upload"
                  />
                  <Label
                    htmlFor="video-upload"
                    className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-white/20 bg-white/5 hover:bg-white/10"
                  >
                    <Upload className="mb-2 h-8 w-8 text-gray-400" />
                    <p className="text-sm text-gray-400">
                      Clique para selecionar um vídeo
                    </p>
                  </Label>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                setOpen(false);
              }}
              className="flex-1 rounded-[8px] transition-all duration-200"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.name || !formData.targetMuscle}
              variant="secondary"
              className="flex-1"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                  Salvando...
                </div>
              ) : (
                "Salvar Exercício"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
