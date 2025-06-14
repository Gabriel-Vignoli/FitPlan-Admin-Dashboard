"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

      const data = await response.json();

      if (response.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError(data.error || "Erro ao fazer login");
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
      <div className="w-full max-w-lg space-y-8 rounded-3xl bg-black px-3 py-6 shadow-lg md:px-5 md:py-10">
        <div className="flex flex-col gap-3 text-center">
          <h2 className="text-xl font-semibold text-white sm:text-3xl md:text-4xl">
            Faça o login na sua conta
          </h2>
          <p className="text-sm text-gray-400 sm:text-base md:text-lg">
            Faça o login para começar a criar treinos e dietas para seus alunos.
          </p>
        </div>

        <div className="space-y-6">
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
              />
            </div>
            <div>
              <Label
                htmlFor="password"
                className="block text-sm font-medium text-white sm:text-base lg:text-lg"
              >
                Sua senha
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={isLoading}
              className="h-10 w-full rounded-[8px] text-base font-semibold text-white transition-colors duration-200 focus:ring-2 sm:h-12 sm:text-xl"
              onClick={handleSubmit}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </div>

          <div className="text-center">
            <Button
              type="button"
              variant="link"
              className="text-primary hover:text-primary/80 h-auto p-0 text-xs focus-visible:underline focus-visible:ring-0 sm:text-sm"
              onClick={() => alert("Funcionalidade em desenvolvimento")}
            >
              Esqueceu sua senha?
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
