"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pen } from "lucide-react";
import { Button } from "./ui/button";

interface Plan {
  id: string;
  name: string;
  price: number;
  description: string;
  duration: number;
}

interface EditPlanDialogProps {
  plan: Plan;
  onPlanUpdated: (updatedPlan: Plan) => void;
}

export default function EditPlanDialog({ plan, onPlanUpdated }: EditPlanDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: plan.name,
    price: plan.price.toString(),
    description: plan.description,
    duration: plan.duration.toString(),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/plans/${plan.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          price: parseFloat(formData.price),
          description: formData.description,
          duration: parseInt(formData.duration),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update plan");
      }

      const updatedPlan = await response.json();
      
      if (updatedPlan && updatedPlan.id) {
        onPlanUpdated(updatedPlan);
      } else {
        console.error("Invalid plan data received:", updatedPlan);
      }
      
      setOpen(false);
    } catch (error) {
      console.error("Error updating plan:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="p-2 rounded-lg bg-white/10 hover:bg-blue-500/30 text-white/70 hover:text-blue-500 transition-colors">
          <Pen className="w-4 h-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-black to-[#101010] rounded-[8px]">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-semibold">Editar Plano</DialogTitle>
          <DialogDescription className="text-gray-400">
            Edite os dados do plano. Clique em salvar quando terminar.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="duration" className="text-sm font-medium text-white">
              Duração (dias)
            </Label>
            <Input
              id="duration"
              name="duration"
              type="number"
              min="1"
              required
              value={formData.duration}
              onChange={handleInputChange}
              className="border"
              placeholder="30"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-white">
              Nome do Plano
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="border"
              placeholder="Ex: Plano Básico"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price" className="text-sm font-medium text-white">
              Preço (R$)
            </Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              required
              value={formData.price}
              onChange={handleInputChange}
              className="border"
              placeholder="99.90"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-white">
              Descrição
            </Label>
            <Textarea
              id="description"
              name="description"
              required
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="border"
              placeholder="Descreva as características do plano..."
            />
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
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-900 disabled:bg-blue-900 rounded-[8px] transition-all duration-200 text-white"
            >
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}