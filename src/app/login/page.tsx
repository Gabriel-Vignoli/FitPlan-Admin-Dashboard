"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPrevPassword, setShowPrevPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      let data = null;
      const contentType = response.headers.get("content-type");
      if (
        response.ok &&
        contentType &&
        contentType.includes("application/json")
      ) {
        data = await response.json();
        router.push("/dashboard");
        router.refresh();
      } else if (contentType && contentType.includes("application/json")) {
        data = await response.json();
        setError(data.error || "Erro ao fazer login");
      } else {
        setError("Erro inesperado: resposta não é JSON");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setError("Erro de conexão");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center gap-3 bg-[url('/bg.png')] bg-cover bg-center bg-no-repeat px-4 py-12 sm:px-6 lg:px-8">
      {/* Loading Overlay */}
      {isLoading && (
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
              <p className="text-lg font-semibold text-white">Entrando...</p>
              <p className="text-sm text-gray-400">Aguarde um momento</p>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-lg space-y-8 rounded-3xl bg-black px-3 py-6 shadow-lg md:px-5 md:py-10">
        <div className="flex flex-col gap-3 text-center">
          <h2 className="text-xl font-semibold text-white sm:text-3xl md:text-4xl">
            Faça o login na sua conta
          </h2>
          <p className="text-sm text-gray-400 sm:text-base md:text-lg">
            Faça o login para começar a criar treinos e dietas para seus alunos.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="block text-sm font-medium text-white sm:text-base lg:text-lg"
              >
                Seu email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <Label
                htmlFor="password"
                className="block text-sm font-medium text-white sm:text-base lg:text-lg"
              >
                Sua senha
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPrevPassword ? "text" : "password"}
                  required
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
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
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={isLoading}
              className="h-10 w-full rounded-[8px] text-base font-semibold text-white transition-colors duration-200 focus:ring-2 sm:h-12 sm:text-xl"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
