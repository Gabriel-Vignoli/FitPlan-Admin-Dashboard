"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Camera,
  User,
  Mail,
  Lock,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { isValidEmail } from "@/lib/utils/validations";
import { useRouter } from "next/navigation";

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
  const [prevPassword, setPrevPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPrevPassword, setShowPrevPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [prevPasswordValid, setPrevPasswordValid] = useState<null | boolean>(
    null,
  );
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
    admin.avatar,
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
    type: "success",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const nameChanged = name.trim() !== admin.name;
    const emailChanged = email.trim() !== admin.email;
    const passwordChanged =
      newPassword.length > 0 ||
      prevPassword.length > 0 ||
      confirmPassword.length > 0;
    const avatarChanged = avatarFile !== null;

    setHasChanges(
      nameChanged || emailChanged || passwordChanged || avatarChanged,
    );
  }, [
    name,
    email,
    newPassword,
    prevPassword,
    confirmPassword,
    avatarFile,
    admin.name,
    admin.email,
  ]);

  const handleGoBack = () => {
    router.back();
  };

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
    else if (!isValidEmail(email)) newErrors.email = "Email inválido";

    // Password change validation
    if (prevPassword || newPassword || confirmPassword) {
      if (!prevPassword) newErrors.prevPassword = "Informe a senha atual";
      else if (prevPasswordValid === false)
        newErrors.prevPassword = "Senha atual incorreta";
      if (!newPassword) newErrors.newPassword = "Informe a nova senha";
      else if (newPassword.length < 6)
        newErrors.newPassword = "Nova senha deve ter pelo menos 6 caracteres";
      if (!confirmPassword) newErrors.confirmPassword = "Confirme a nova senha";
      else if (newPassword !== confirmPassword)
        newErrors.confirmPassword = "Senhas não coincidem";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate previous password when it changes
  useEffect(() => {
    if (prevPassword.length > 0) {
      const timeout = setTimeout(async () => {
        try {
          const res = await fetch("/api/admin/profile/check-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password: prevPassword }),
          });
          const data = await res.json();
          setPrevPasswordValid(data.valid === true);
        } catch {
          setPrevPasswordValid(null);
        }
      }, 500);
      return () => clearTimeout(timeout);
    } else {
      setPrevPasswordValid(null);
    }
  }, [prevPassword]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast("Arquivo muito grande. Máximo 5MB.", "error");
        return;
      }
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
      if (prevPassword && newPassword && confirmPassword) {
        formData.append("prevPassword", prevPassword);
        formData.append("newPassword", newPassword);
        formData.append("confirmPassword", confirmPassword);
      }
      if (avatarFile) formData.append("avatar", avatarFile);

      const res = await fetch("/api/admin/profile", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        showToast("Perfil atualizado com sucesso!", "success");
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
            className="relative w-full rounded-[8px] border bg-gradient-to-br from-[#151516] to-[#0a0a0c] p-12 shadow-2xl"
            onSubmit={handleSubmit}
          >
            <div className="mb-10 text-center">
              <h2 className="mb-3 text-4xl font-bold text-white">
                Editar Perfil
              </h2>
              <p className="text-lg text-gray-400">
                Atualize suas informações pessoais
              </p>
            </div>

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
              <div className="flex flex-col items-center justify-start lg:col-span-1">
                <div className="mb-6 flex flex-col items-center gap-6">
                  <div className="group relative">
                    <div
                      className="relative h-40 w-40 cursor-pointer overflow-hidden rounded-full border-4 border-gray-200 bg-indigo-600"
                      onClick={() => fileInputRef.current?.click()} // clique na imagem também
                    >
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
                      className="border"
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
                      className="border"
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
                    htmlFor="prevPassword"
                    className="flex items-center gap-2 text-base font-medium text-white"
                  >
                    <Lock className="h-5 w-5" />
                    Senha Atual
                  </Label>
                  <div className="relative">
                    <Input
                      id="prevPassword"
                      type={showPrevPassword ? "text" : "password"}
                      value={prevPassword}
                      onChange={(e) => {
                        setPrevPassword(e.target.value);
                        if (errors.prevPassword)
                          setErrors((prev) => ({ ...prev, prevPassword: "" }));
                      }}
                      className="border pr-10"
                      placeholder="Digite sua senha atual"
                    />
                    <button
                      type="button"
                      className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                      tabIndex={-1}
                      onClick={() => setShowPrevPassword((v) => !v)}
                    >
                      {showPrevPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.prevPassword && (
                    <p className="flex items-center gap-1 text-sm text-red-400">
                      <AlertCircle className="h-4 w-4" />
                      {errors.prevPassword}
                    </p>
                  )}
                  {prevPassword &&
                    prevPasswordValid === true &&
                    !errors.prevPassword && (
                      <p className="flex items-center gap-1 text-sm text-emerald-400">
                        <Check className="h-4 w-4" /> Senha correta
                      </p>
                    )}
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="newPassword"
                    className="flex items-center gap-2 text-base font-medium text-white"
                  >
                    <Lock className="h-5 w-5" />
                    Nova Senha
                  </Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        if (errors.newPassword)
                          setErrors((prev) => ({ ...prev, newPassword: "" }));
                      }}
                      className="border pr-10"
                      placeholder="Digite a nova senha"
                    />
                    <button
                      type="button"
                      className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                      tabIndex={-1}
                      onClick={() => setShowNewPassword((v) => !v)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="flex items-center gap-1 text-sm text-red-400">
                      <AlertCircle className="h-4 w-4" />
                      {errors.newPassword}
                    </p>
                  )}
                  {!errors.newPassword && newPassword && (
                    <p className="text-sm text-gray-400">Mínimo 6 caracteres</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="confirmPassword"
                    className="flex items-center gap-2 text-base font-medium text-white"
                  >
                    <Lock className="h-5 w-5" />
                    Confirmar Nova Senha
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword)
                          setErrors((prev) => ({
                            ...prev,
                            confirmPassword: "",
                          }));
                      }}
                      className="border pr-10"
                      placeholder="Confirme a nova senha"
                    />
                    <button
                      type="button"
                      className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                      tabIndex={-1}
                      onClick={() => setShowConfirmPassword((v) => !v)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="flex items-center gap-1 text-sm text-red-400">
                      <AlertCircle className="h-4 w-4" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-8 h-14 flex-1 text-lg disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={handleGoBack}
                  >
                    Voltar
                  </Button>

                  <Button
                    type="submit"
                    className="bg-primary/90 mt-8 h-14 flex-1 text-lg text-white disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={loading || !hasChanges}
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
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    {/* Outer spinning ring */}
                    <div className="border-primary/20 border-t-primary h-20 w-20 animate-spin rounded-full border-4"></div>
                    {/* Inner pulsing circle */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-12 w-12 animate-pulse rounded-full bg-white/20"></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-white">
                      Alterando Dados...
                    </p>
                    <p className="text-sm text-gray-400">Aguarde um momento</p>
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
