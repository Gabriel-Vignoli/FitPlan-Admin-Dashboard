"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { formatCPF, formatPhone } from "@/lib/utils/formatters";
import { validateBirthDateBR } from "@/lib/utils/validations";

interface Plan {
  id: string;
  name: string;
  price: number;
}

interface AddAlunoDialogProps {
  onAlunoCreated?: () => void;
}

export default function AddAlunoDialog({
  onAlunoCreated,
}: AddAlunoDialogProps) {
  const [open, setOpen] = useState(false);
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
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    handleInputChange("cpf", formatted);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formatted = formatPhone(inputValue);
    handleInputChange("phone", formatted);
  };

  const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 8) val = val.slice(0, 8);
    if (val.length >= 5) {
      val = val.replace(/(\d{2})(\d{2})(\d{1,4})/, "$1/$2/$3");
    } else if (val.length >= 3) {
      val = val.replace(/(\d{2})(\d{1,2})/, "$1/$2");
    }
    handleInputChange("birthDate", val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    const birthValidation = validateBirthDateBR(formData.birthDate);
    if (!birthValidation.valid) {
      setError(birthValidation.error || "Data de nascimento inválida");
      setIsLoading(false);
      return;
    }

    try {
      const isoBirthDate = birthValidation.date!.toISOString().split("T")[0];

      const payload = { ...formData, birthDate: isoBirthDate };

      const response = await fetch("/api/alunos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Aluno criado com sucesso!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          birthDate: "",
          cpf: "",
          planId: "",
        });

        if (onAlunoCreated) {
          setTimeout(() => {
            onAlunoCreated();
            setOpen(false);
          }, 1500);
        } else {
          setTimeout(() => setOpen(false), 1500);
        }
      } else {
        setError(data.error || "Erro ao criar aluno");
      }
    } catch (error) {
      console.error("Erro ao criar aluno:", error);
      setError("Erro de conexão");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setError("");
      setSuccess("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="text-white">
          <Plus className="h-4 w-4" />
          Adicionar Aluno
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-[8px] bg-gradient-to-br from-black to-[#101010] sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">
            Adicionar Novo Aluno
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Preencha os dados para criar uma nova conta de aluno.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-600 text-green-800">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-white">
                Nome Completo
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Nome completo do aluno"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-white">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="email@exemplo.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-white">
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
                className="border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf" className="text-sm font-medium text-white">
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
                className="border"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="birthDate"
                className="text-sm font-medium text-white"
              >
                Data de Nascimento
              </Label>
              <Input
                id="birthDate"
                name="birthDate"
                type="text"
                inputMode="numeric"
                placeholder="dd/mm/aaaa"
                required
                value={formData.birthDate}
                onChange={handleBirthDateChange}
                className="border"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="planId"
                className="text-sm font-medium text-white"
              >
                Plano
              </Label>
              <Select
                value={formData.planId}
                onValueChange={(value) => handleInputChange("planId", value)}
                required
              >
                <SelectTrigger className="w-full rounded-[8px] border-white/40">
                  <SelectValue
                    placeholder={
                      isLoadingPlans
                        ? "Carregando planos..."
                        : "Selecione um plano"
                    }
                  />
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

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-[8px] transition-all duration-200"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || isLoadingPlans}
              variant="secondary"
              className="flex-1"
            >
              {isLoading ? "Criando..." : "Criar Aluno"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
