"use client";

import Head from "@/components/Header";
import CreatePlanDialog from "@/components/CreatePlanDialog";
import EditPlanDialog from "@/components/EditPlanDialog";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import DeleteButton from "@/components/DeleteButton";

interface Plan {
  id: string;
  name: string;
  price: number;
  description: string;
  duration: number;
}

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPlans() {
      try {
        const response = await fetch("/api/plans");

        if (!response.ok) {
          throw new Error("Failed to fetch plans");
        }

        const data = await response.json();
        setPlans(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    fetchPlans();
  }, []);

  const handlePlanCreated = (newPlan: Plan) => {
    setPlans((prevPlans) => [...prevPlans, newPlan]);
  };

  const handlePlanUpdated = (updatedPlan: Plan) => {
    setPlans((prevPlans) =>
      prevPlans.map((plan) =>
        plan.id === updatedPlan.id ? updatedPlan : plan,
      ),
    );
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex h-64 items-center justify-center">
          <div className="text-white/70">Carregando planos...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="rounded-[8px] border border-red-500/30 bg-red-500/10 p-4">
          <p className="text-red-400">Erro ao carregar planos: {error}</p>
        </div>
      </div>
    );
  }

  const handlePlanDeleted = (id: string) => {
    setPlans((prevPlans) => prevPlans.filter((plan) => plan.id !== id));
  };

  return (
    <div className="p-8">
      <Head
        title="Gerencie seus planos"
        description="Escolha o nome, preço e descrição para seu plano"
        buttonText="Adicionar Plano"
        icon={<Plus />}
        customButton={<CreatePlanDialog onPlanCreated={handlePlanCreated} />}
        margin={8}
      />

      {plans.map((plan) => (
        <div
          key={plan.id}
          className="hover:shadow-primary/20 mb-4 w-full rounded-[8px] border border-white/20 bg-white/5 p-4 transition-all duration-200 hover:scale-[1.01] hover:shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="mb-2 flex gap-3">
                <p className="text-lg font-medium text-white">{plan.name}</p>
                <p className="text-lg font-medium text-green-600">
                  R${plan.price}
                </p>
                <p className="rounded bg-blue-500/20 px-2 py-1 text-sm font-medium text-blue-400">
                  {plan.duration} dias
                </p>
              </div>
              <p className="text-base text-white/70">{plan.description}</p>
            </div>
            <div className="flex gap-2">
              <EditPlanDialog plan={plan} onPlanUpdated={handlePlanUpdated} />
              <DeleteButton
                id={plan.id}
                endpoint="/api/plans"
                itemName="plano"
                onDeleted={handlePlanDeleted}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
