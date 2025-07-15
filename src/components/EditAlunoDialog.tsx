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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Edit } from "lucide-react";
import { formatCPF, formatPhone } from "@/lib/utils/formatters";

interface Plan {
  id: string;
  name: string;
  price: number;
}

interface Student {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  birthDate: string;
  cpf: string;
  height: number | null;
  weight: number | null;
  bodyFat: number | null;
  isActive: boolean;
  planId: string;
  paymentStatus: string;
  createdAt: string;
}

interface EditAlunoDialogProps {
  student: Student;
  onStudentUpdated: (updatedStudent: Student) => void;
}

export default function EditAlunoDialog({ student, onStudentUpdated }: EditAlunoDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: student.name || "",
    email: student.email || "",
    password: student.password || "",
    phone: student.phone || "",
    birthDate: student.birthDate ? new Date(student.birthDate).toISOString().split('T')[0] : "",
    cpf: student.cpf || "",
    height: student.height?.toString() || "",
    weight: student.weight?.toString() || "",
    bodyFat: student.bodyFat?.toString() || "",
    isActive: student.isActive,
    planId: student.planId || "",
    paymentStatus: student.paymentStatus || "PENDING",
  });

  // Payment status options with Portuguese labels
  const paymentStatusOptions = [
    { value: 'PENDING', label: 'Aguardando confirmação' },
    { value: 'PAID', label: 'Pagamento confirmado' },
    { value: 'UNPAID', label: 'Não pago' },
  ];

  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Reset form data when student changes
  useEffect(() => {
    setFormData({
      name: student.name || "",
      email: student.email || "",
      password: student.password || "",
      phone: student.phone || "",
      birthDate: student.birthDate ? new Date(student.birthDate).toISOString().split('T')[0] : "",
      cpf: student.cpf || "",
      height: student.height?.toString() || "",
      weight: student.weight?.toString() || "",
      bodyFat: student.bodyFat?.toString() || "",
      isActive: student.isActive,
      planId: student.planId || "",
      paymentStatus: student.paymentStatus || "PENDING",
    });
  }, [student]);

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

  const handleInputChange = (field: string, value: string | boolean) => {
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
      // Prepare data for submission
      const submitData = {
        ...formData,
        height: formData.height ? parseFloat(formData.height) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        bodyFat: formData.bodyFat ? parseFloat(formData.bodyFat) : null,
        birthDate: formData.birthDate ? new Date(formData.birthDate).toISOString() : null,
        // Only include password if it's not empty
        ...(formData.password && { password: formData.password }),
      };

      const response = await fetch(`/api/alunos/${student.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Aluno atualizado com sucesso!");
        if (data && data.id) {
          onStudentUpdated(data);
        }
        setTimeout(() => {
          setOpen(false);
          setSuccess("");
        }, 1500);
      } else {
        setError(data.error || "Erro ao atualizar aluno");
      }
    } catch (error) {
      console.error("Erro ao atualizar aluno:", error);
      setError("Erro de conexão");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex-1 hover:bg-blue-600/20 hover:text-white text-blue-400 border border-blue-500/40 hover:border-blue-500/60">
          <Edit className="w-4 h-4" />
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl bg-gradient-to-br from-black to-[#101010] rounded-[8px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-semibold">Editar Aluno</DialogTitle>
          <DialogDescription className="text-gray-400">
            Atualize os dados do aluno {student.name}. Clique em salvar quando terminar.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                onChange={(e) => handleInputChange('name', e.target.value)}
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
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-white">
                Senha
              </Label>
              <Input
                id="password"
                name="password"
                type="text"
                required
                placeholder="Senha do aluno"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
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
                placeholder="000.000.000-00"
                value={formData.cpf}
                onChange={handleCPFChange}
                className="border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate" className="text-sm font-medium text-white">
                Data de Nascimento
              </Label>
              <Input
                id="birthDate"
                name="birthDate"
                type="date"
                required
                value={formData.birthDate}
                onChange={(e) => handleInputChange('birthDate', e.target.value)}
                className="border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="height" className="text-sm font-medium text-white">
                Altura (cm)
              </Label>
              <Input
                id="height"
                name="height"
                type="number"
                step="0.1"
                min="0"
                max="300"
                placeholder="170.5"
                value={formData.height}
                onChange={(e) => handleInputChange('height', e.target.value)}
                className="border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight" className="text-sm font-medium text-white">
                Peso (kg)
              </Label>
              <Input
                id="weight"
                name="weight"
                type="number"
                step="0.1"
                min="0"
                max="500"
                placeholder="70.5"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                className="border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bodyFat" className="text-sm font-medium text-white">
                Gordura Corporal (%)
              </Label>
              <Input
                id="bodyFat"
                name="bodyFat"
                type="number"
                step="0.1"
                min="0"
                max="100"
                placeholder="15.5"
                value={formData.bodyFat}
                onChange={(e) => handleInputChange('bodyFat', e.target.value)}
                className="border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="planId" className="text-sm font-medium text-white">
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
                      {plan.name} - R${plan.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentStatus" className="text-sm font-medium text-white">
                Status de Pagamento
              </Label>
              <Select
                value={formData.paymentStatus}
                onValueChange={(value) => handleInputChange('paymentStatus', value)}
                required
              >
                <SelectTrigger className="rounded-[8px] border-white/40 w-full">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  {paymentStatusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="isActive" className="text-sm font-medium text-white">
                Status do Aluno
              </Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                />
                <Label htmlFor="isActive" className="text-sm text-white/70">
                  {formData.isActive ? "Ativo" : "Inativo"}
                </Label>
              </div>
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
              {isLoading ? "Atualizando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}