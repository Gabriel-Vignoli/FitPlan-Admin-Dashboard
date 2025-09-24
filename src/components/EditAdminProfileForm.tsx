"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, User, Mail, Lock, Check, AlertCircle } from "lucide-react";
import Link from "next/link";

interface AdminProfileProps {
  admin: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

interface ToastState {
  show: boolean;
  message: string;
  type: "success" | "error";
}

export default function EditAdminProfileForm({ admin }: AdminProfileProps) {
  const [name, setName] = useState(admin.name);
  const [email, setEmail] = useState(admin.email);
  const [password, setPassword] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
    admin.avatar,
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
    type: "success",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "success" }),
      4000,
    );
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = "Nome é obrigatório";
    if (!email.trim()) newErrors.email = "Email é obrigatório";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Email inválido";
    if (password && password.length < 6)
      newErrors.password = "Senha deve ter pelo menos 6 caracteres";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showToast("Arquivo muito grande. Máximo 5MB.", "error");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        showToast("Apenas arquivos de imagem são permitidos.", "error");
        return;
      }

      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("email", email.trim());
      if (password) formData.append("password", password);
      if (avatarFile) formData.append("avatar", avatarFile);

      const res = await fetch("/api/admin/profile", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        showToast("Perfil atualizado com sucesso!", "success");
        // Optional: Update parent component state instead of reload
        setTimeout(() => window.location.reload(), 1500);
      } else {
        const errorData = await res.json().catch(() => ({}));
        showToast(errorData.message || "Erro ao atualizar perfil.", "error");
      }
    } catch (error) {
      showToast(
        "Erro de conexão. Tente novamente.",
        error instanceof Error ? "error" : "error",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg px-4 py-3 shadow-lg transition-all duration-300 ${
            toast.type === "success"
              ? "bg-emerald-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {toast.type === "success" ? (
            <Check className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <form
            className="relative w-full rounded-[8px] border border-white/30 bg-gradient-to-br from-[#060606] to-[#18181b] p-12 shadow-2xl"
            onSubmit={handleSubmit}
          >
            {/* Header */}
            <div className="mb-10 text-center">
              <h2 className="mb-3 text-4xl font-bold text-white">
                Editar Perfil
              </h2>
              <p className="text-lg text-gray-400">
                Atualize suas informações pessoais
              </p>
            </div>

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
              {/* Avatar Section - Left Column */}
              <div className="flex flex-col items-center justify-start lg:col-span-1">
                <div className="mb-6 flex flex-col items-center gap-6">
                  <div className="group relative">
                    <div className="relative h-40 w-40 overflow-hidden rounded-full border-4 border-gray-200 bg-indigo-600">
                      <Image
                        src={avatarPreview || "/gym-icon.svg"}
                        alt="Foto de perfil"
                        width={160}
                        height={160}
                        className="h-full w-full rounded-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <Camera className="h-10 w-10 text-white" />
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                    <button
                      type="button"
                      className="bg-primary hover:bg-primary/80 absolute -right-2 -bottom-2 rounded-full p-4 text-white shadow-lg transition-colors duration-200"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="text-center">
                    <p className="mb-2 text-sm text-gray-400">
                      Clique na foto para alterar
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG até 5MB</p>
                  </div>
                </div>
              </div>

              {/* Form Fields - Right Columns */}
              <div className="space-y-8 lg:col-span-2">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <Label
                      htmlFor="name"
                      className="flex items-center gap-2 text-base font-medium text-white"
                    >
                      <User className="h-5 w-5" />
                      Nome
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name)
                          setErrors((prev) => ({ ...prev, name: "" }));
                      }}
                      className={`focus:border-primary focus:ring-primary/20 h-12 border-white/30 bg-[#23272f] text-base text-white placeholder:text-gray-400 ${
                        errors.name
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                          : ""
                      }`}
                      placeholder="Seu nome completo"
                      required
                    />
                    {errors.name && (
                      <p className="flex items-center gap-1 text-sm text-red-400">
                        <AlertCircle className="h-4 w-4" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="email"
                      className="flex items-center gap-2 text-base font-medium text-white"
                    >
                      <Mail className="h-5 w-5" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email)
                          setErrors((prev) => ({ ...prev, email: "" }));
                      }}
                      className={`focus:border-primary focus:ring-primary/20 h-12 border-white/30 bg-[#23272f] text-base text-white placeholder:text-gray-400 ${
                        errors.email
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                          : ""
                      }`}
                      placeholder="seu@email.com"
                      required
                    />
                    {errors.email && (
                      <p className="flex items-center gap-1 text-sm text-red-400">
                        <AlertCircle className="h-4 w-4" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="password"
                    className="flex items-center gap-2 text-base font-medium text-white"
                  >
                    <Lock className="h-5 w-5" />
                    Nova Senha
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password)
                        setErrors((prev) => ({ ...prev, password: "" }));
                    }}
                    className={`focus:border-primary focus:ring-primary/20 h-12 border-white/30 bg-[#23272f] text-base text-white placeholder:text-gray-400 ${
                      errors.password
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        : ""
                    }`}
                    placeholder="Deixe em branco para manter a atual"
                  />
                  {errors.password && (
                    <p className="flex items-center gap-1 text-sm text-red-400">
                      <AlertCircle className="h-4 w-4" />
                      {errors.password}
                    </p>
                  )}
                  {!errors.password && password && (
                    <p className="text-sm text-gray-400">Mínimo 6 caracteres</p>
                  )}
                </div>

                {/* Button Div */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="mt-8 h-14 flex-1 text-lg disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Link href="/dashboard">Voltar</Link>{" "}
                  </Button>
                  <Button
                    type="submit"
                    className="bg-primary/90 mt-8 h-14 flex-1 text-lg text-white disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        <span>Salvando...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-3">
                        <Check className="h-6 w-6" />
                        <span>Salvar Alterações</span>
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Loading Overlay */}
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-[8px] bg-[#18181b]/80 backdrop-blur-sm">
                <div className="rounded-lg bg-[#23272f] p-6 shadow-xl">
                  <div className="flex items-center gap-4">
                    <div className="border-primary/30 border-t-primary h-8 w-8 animate-spin rounded-full border-2" />
                    <span className="text-lg font-medium text-white">
                      Processando...
                    </span>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
