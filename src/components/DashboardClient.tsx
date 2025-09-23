"use client";

import StatCard from "@/components/StatCard";
import MainChart from "@/components/MainChart";
import { Button } from "@/components/ui/button";
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
  chartHistory: {
    thisMonth: Array<{
      date: string;
      totalStudents: number;
      newStudents: number;
    }>;
    last3Months: Array<{
      date: string;
      totalStudents: number;
      newStudents: number;
    }>;
    lastYear: Array<{
      date: string;
      totalStudents: number;
      newStudents: number;
    }>;
  };
}

export default function DashboardClient() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [selectedRange, setSelectedRange] = useState<
    "thisMonth" | "last3Months" | "lastYear"
  >("thisMonth");

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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Chart data for each tab
  const chartHistory = dashboardData?.chartHistory || {
    thisMonth: [],
    last3Months: [],
    lastYear: [],
  };
  const chartData = chartHistory[selectedRange];

  return (
    <div className="flex flex-col gap-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total de Alunos"
          value={dashboardData?.students?.total?.toString() || "0"}
          percentage={`${dashboardData?.students?.changePercentage || 0}%`}
          isPositive={(dashboardData?.students?.changePercentage || 0) >= 0}
          description="Crescimento de alunos este mês"
        />
        <StatCard
          title="Novos Alunos"
          value={dashboardData?.students?.current?.toString() || "0"}
          percentage={`${dashboardData?.students?.changePercentage || 0}%`}
          isPositive={(dashboardData?.students?.changePercentage || 0) >= 0}
          description={
            typeof dashboardData?.students?.changePercentage === "number" &&
            dashboardData.students.changePercentage < 0
              ? "Atenção: queda de novos alunos"
              : "Novos alunos este mês"
          }
        />
        <StatCard
          title="Receita"
          value={formatCurrency(dashboardData?.revenue?.current || 0)}
          percentage={`${dashboardData?.revenue?.changePercentage || 0}%`}
          isPositive={(dashboardData?.revenue?.changePercentage || 0) >= 0}
          description={
            typeof dashboardData?.revenue?.changePercentage === "number" &&
            dashboardData.revenue.changePercentage < 0
              ? "Receita caiu este mês"
              : "Receita subiu este mês"
          }
        />
        <StatCard
          title="Crescimento"
          value={
            dashboardData?.students?.changePercentage
              ? `${dashboardData.students.changePercentage}%`
              : "0%"
          }
          percentage={
            dashboardData?.students?.changePercentage
              ? `${dashboardData.students.changePercentage}%`
              : "0%"
          }
          isPositive={(dashboardData?.students?.changePercentage || 0) >= 0}
          description="Progresso em relação à meta"
        />
      </div>

      {/* Main Chart Section with Tabs */}
      <div className="rounded-[8px] bg-gradient-to-br from-[#19191b] to-[#17191d
      ] p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Total de Alunos</h2>
          <div className="flex gap-2">
            <Button
              className={`px-4 py-1 font-medium text-white transition ${selectedRange === "thisMonth" ? "bg-primary/80" : "bg-[#23272f] hover:bg-[#18181b]"}`}
              onClick={() => setSelectedRange("thisMonth")}
            >
              Este mês (cada 3 dias)
            </Button>
            <Button
              className={`px-4 py-1 font-medium text-white transition ${selectedRange === "last3Months" ? "bg-primary/80" : "bg-[#23272f] hover:bg-[#18181b]"}`}
              onClick={() => setSelectedRange("last3Months")}
            >
              Últimos 3 meses (cada 15 dias)
            </Button>
            <Button
              className={`px-4 py-1 font-medium text-white transition ${selectedRange === "lastYear" ? "bg-primary/80" : "bg-[#23272f] hover:bg-[#18181b]"}`}
              onClick={() => setSelectedRange("lastYear")}
            >
              Último ano (mensal)
            </Button>
          </div>
        </div>
        <div className="h-64 w-full">
          <MainChart data={chartData} />
        </div>
      </div>
    </div>
  );
}
