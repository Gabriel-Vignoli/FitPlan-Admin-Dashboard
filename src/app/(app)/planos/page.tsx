"use client";

import Header from "@/components/Header";
import CreatePlanDialog from "@/components/CreatePlanDialog";
import EditPlanDialog from "@/components/EditPlanDialog";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import DeleteButton from "@/components/DeleteButton";
import Loader from "@/components/Loader";

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

  const handlePlanDeleted = (id: string) => {
    setPlans((prevPlans) => prevPlans.filter((plan) => plan.id !== id));
  };

  return (
    <div className="p-3 sm:p-5 md:p-8">
      <Header
        title="Gerencie seus planos"
        description="Escolha o nome, preço e descrição para seu plano"
        buttonText="Adicionar Plano"
        icon={<Plus />}
        customButton={<CreatePlanDialog onPlanCreated={handlePlanCreated} />}
        margin={8}
      />

      {loading ? (
        <Loader text="Carregando planos..." size="lg" />
      ) : error ? (
        <div className="rounded-[8px] border border-red-500/30 bg-red-500/10 p-4">
          <p className="text-red-400">Erro ao carregar planos: {error}</p>
        </div>
      ) : (
        plans.map((plan) => (
          <div
            key={plan.id}
            className="hover:shadow-primary/20 mb-4 w-full rounded-[8px] border border-white/20 bg-white/5 p-3 transition-all duration-200 hover:scale-[1.01] hover:shadow-lg sm:p-4"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex flex-wrap gap-2 sm:gap-3">
                  <p className="max-w-[120px] truncate text-base font-medium text-white sm:max-w-none sm:text-lg">
                    {plan.name}
                  </p>
                  <p className="max-w-[80px] truncate text-base font-medium text-green-600 sm:max-w-none sm:text-lg">
                    R${plan.price}
                  </p>
                  <p className="max-w-[80px] truncate rounded-[8px] bg-blue-500/20 px-2 py-1 text-xs font-medium text-blue-400 sm:max-w-none sm:text-sm">
                    {plan.duration} dias
                  </p>
                </div>
                <p className="text-sm break-words text-white/70 sm:text-base">
                  {plan.description}
                </p>
              </div>
              <div className="mt-2 flex gap-2 sm:mt-0">
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
        ))
      )}
    </div>
  );
}
