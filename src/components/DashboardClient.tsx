"use client";

import StatCard from "@/components/StatCard";
import { useState, useEffect } from "react";
import Loader from "./Loader";

interface DashboardData {
  students: {
    current: number;
    previous: number;
    total: number;
    changePercentage: number;
  };
  revenue: {
    current: number;
    previous: number;
    changePercentage: number;
  };
}

export default function DashboardClient() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      const response = await fetch("/api/dashboard", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <Loader text="Carregando dados do dashboard" size="lg" />;
  }

  const createChartData = (current: number, previous: number) => {
    return [
      { name: "Mês Anterior", value: previous },
      { name: "Mês Atual", value: current },
    ];
  };

  // Helper function to format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <>
      {/* Estatísticas */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total de Alunos"
          value={dashboardData?.students?.total?.toString() || "0"}
          percentage={`${dashboardData?.students?.changePercentage || 0}%`}
          chartData={createChartData(
            dashboardData?.students?.current || 0,
            dashboardData?.students?.previous || 0
          )}
          chartColor="#10b981"
          isPositive={(dashboardData?.students?.changePercentage || 0) >= 0}
        />

        <StatCard
          title="Novos Alunos (Este Mês)"
          value={dashboardData?.students?.current?.toString() || "0"}
          percentage={`${dashboardData?.students?.changePercentage || 0}%`}
          chartData={createChartData(
            dashboardData?.students?.current || 0,
            dashboardData?.students?.previous || 0
          )}
          chartColor={(dashboardData?.students?.changePercentage || 0) >= 0 ? "#10b981" : "#ef4444"}
          isPositive={(dashboardData?.students?.changePercentage || 0) >= 0}
        />

        <div className="md:col-span-2 lg:col-span-1">
          <StatCard
            title="Receita Este Mês"
            value={formatCurrency(dashboardData?.revenue?.current || 0)}
            percentage={`${dashboardData?.revenue?.changePercentage || 0}%`}
            chartData={createChartData(
              dashboardData?.revenue?.current || 0,
              dashboardData?.revenue?.previous || 0
            )}
            chartColor={(dashboardData?.revenue?.changePercentage || 0) >= 0 ? "#10b981" : "#ef4444"}
            isPositive={(dashboardData?.revenue?.changePercentage || 0) >= 0}
          />
        </div>
      </div>

      {/* Rest of your dashboard content... */}
      <div className="mb-8 rounded-lg bg-white shadow">
        <div className="border-b p-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Treinos Favoritos
          </h2>
        </div>
        <div className="p-6">
          <p className="text-gray-500">Nenhum treino favorito encontrado</p>
        </div>
      </div>
    </>
  );
}