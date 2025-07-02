"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCPF, formatPhone } from "@/lib/utils/formatters";

interface Plan {
  id: string;
  name: string;
  price: number;
}

interface CreateUserFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function AddAlunoForm({ onSuccess, onCancel }: CreateUserFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    birthDate: "",
    cpf: "",
    planId: "",
  });
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch available plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch("/api/plans");
        if (response.ok) {
          const plansData = await response.json();
          setPlans(plansData);
        }
      } catch (error) {
        console.error("Erro ao carregar planos:", error);
      } finally {
        setIsLoadingPlans(false);
      }
    };

    fetchPlans();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
 

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    handleInputChange('cpf', formatted);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formatted = formatPhone(inputValue);
    handleInputChange('phone', formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/alunos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Usuário criado com sucesso!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          birthDate: "",
          cpf: "",
          planId: "",
        });
        if (onSuccess) {
          setTimeout(() => onSuccess(), 1500);
        }
      } else {
        setError(data.error || "Erro ao criar usuário");
      }
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      setError("Erro de conexão");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl space-y-8 rounded-3xl bg-black px-3 py-6 shadow-lg md:px-5 md:py-10">
      <div className="flex flex-col gap-3 text-center">
        <h2 className="text-xl font-semibold text-white sm:text-3xl md:text-4xl">
          Adicionar Novo Aluno
        </h2>
        <p className="text-sm text-white/70 sm:text-base md:text-lg">
          Preencha os dados para criar uma nova conta de aluno.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-600 bg-green-50 text-green-800">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="block text-sm font-medium text-white sm:text-base lg:text-lg"
            >
              Nome Completo
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Nome completo do aluno"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="block text-sm font-medium text-white sm:text-base lg:text-lg"
            >
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="email@exemplo.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="phone"
              className="block text-sm font-medium text-white sm:text-base lg:text-lg"
            >
              Telefone
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              required
              placeholder="(00) 00000-0000"
              value={formData.phone}
              onChange={handlePhoneChange}
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="cpf"
              className="block text-sm font-medium text-white sm:text-base lg:text-lg"
            >
              CPF
            </Label>
            <Input
              id="cpf"
              name="cpf"
              type="text"
              required
              placeholder="000.000.000-00"
              value={formData.cpf}
              onChange={handleCPFChange}
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="birthDate"
              className="block text-sm font-medium text-white sm:text-base lg:text-lg"
            >
              Data de Nascimento
            </Label>
            <Input
              id="birthDate"
              name="birthDate"
              type="date"
              required
              value={formData.birthDate}
              onChange={(e) => handleInputChange('birthDate', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="planId"
              className="block text-sm font-medium text-white sm:text-base lg:text-lg"
            >
              Plano
            </Label>
            <Select
              value={formData.planId}
              onValueChange={(value) => handleInputChange('planId', value)}
              required
            >
              <SelectTrigger className="rounded-[8px] border-white/40 w-full">
                <SelectValue placeholder={isLoadingPlans ? "Carregando planos..." : "Selecione um plano"} />
              </SelectTrigger>
              <SelectContent>
                {plans.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    {plan.name} R${plan.price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isLoading || isLoadingPlans}
            className="h-10 flex-1 rounded-[8px] text-base font-semibold text-white transition-colors duration-200 focus:ring-2 sm:h-12 sm:text-xl"
          >
            {isLoading ? "Criando..." : "Criar Aluno"}
          </Button>

          {onCancel && (
            <Button
              type="button"
              variant="destructive"
              onClick={onCancel}
              className="h-10 rounded-[8px] text-base font-semibold transition-colors duration-200 focus:ring-2 sm:h-12 sm:text-xl"
            >
              Cancelar
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}