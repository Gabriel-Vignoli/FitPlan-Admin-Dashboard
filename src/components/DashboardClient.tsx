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
    totalLastMonth: number;
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
      {/* Current Month Stat Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard
          title="Total de Alunos"
          value={dashboardData?.students?.total?.toString() || "0"}
          percentage={`${
            dashboardData?.students?.totalLastMonth &&
            dashboardData?.students?.total &&
            dashboardData.students.totalLastMonth > 0
              ? Math.round(
                  ((dashboardData.students.total -
                    dashboardData.students.totalLastMonth) /
                    dashboardData.students.totalLastMonth) *
                    100,
                )
              : dashboardData?.students?.total &&
                  dashboardData.students.total > 0
                ? 100
                : 0
          }%`}
          isPositive={
            (dashboardData?.students?.total || 0) >
            (dashboardData?.students?.totalLastMonth || 0)
          }
          description="Crescimento de alunos este mês"
        />
        <StatCard
          title="Novos Alunos"
          value={dashboardData?.students?.current?.toString() || "0"}
          percentage={`${
            dashboardData?.students?.previous &&
            dashboardData?.students?.current !== undefined &&
            dashboardData.students.previous > 0
              ? Math.round(
                  ((dashboardData.students.current -
                    dashboardData.students.previous) /
                    dashboardData.students.previous) *
                    100,
                )
              : dashboardData?.students?.current &&
                  dashboardData.students.current > 0
                ? 100
                : 0
          }%`}
          isPositive={
            (dashboardData?.students?.current || 0) >=
            (dashboardData?.students?.previous || 0)
          }
          description={
            (dashboardData?.students?.current || 0) <
            (dashboardData?.students?.previous || 0)
              ? "Atenção: queda de novos alunos"
              : "Novos alunos este mês"
          }
        />
        <StatCard
          title="Receita"
          value={formatCurrency(dashboardData?.revenue?.current || 0)}
          percentage={`${
            dashboardData?.revenue?.previous &&
            dashboardData?.revenue?.current !== undefined &&
            dashboardData.revenue.previous > 0
              ? Math.round(
                  ((dashboardData.revenue.current -
                    dashboardData.revenue.previous) /
                    dashboardData.revenue.previous) *
                    100,
                )
              : dashboardData?.revenue?.current &&
                  dashboardData.revenue.current > 0
                ? 100
                : 0
          }%`}
          isPositive={
            (dashboardData?.revenue?.current || 0) >=
            (dashboardData?.revenue?.previous || 0)
          }
          description={
            (dashboardData?.revenue?.current || 0) <
            (dashboardData?.revenue?.previous || 0)
              ? "Receita caiu este mês"
              : "Receita subiu este mês"
          }
        />
      </div>

      {/* Main Chart Section with Tabs */}
      <div className="rounded-[8px] bg-gradient-to-br from-[#19191b] to-[#17191d] p-4 shadow-lg sm:p-6">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-white sm:text-xl">
            Total de Alunos
          </h2>
          <div className="flex flex-wrap gap-2">
            <Button
              className={`px-3 py-1 font-medium text-white transition sm:px-4 ${selectedRange === "thisMonth" ? "bg-primary/80" : "bg-[#23272f] hover:bg-[#18181b]"}`}
              onClick={() => setSelectedRange("thisMonth")}
            >
              Este mês (até ontem)
            </Button>
            <Button
              className={`px-3 py-1 font-medium text-white transition sm:px-4 ${selectedRange === "last3Months" ? "bg-primary/80" : "bg-[#23272f] hover:bg-[#18181b]"}`}
              onClick={() => setSelectedRange("last3Months")}
            >
              Últimos 3 meses (cada 15 dias)
            </Button>
            <Button
              className={`px-3 py-1 font-medium text-white transition sm:px-4 ${selectedRange === "lastYear" ? "bg-primary/80" : "bg-[#23272f] hover:bg-[#18181b]"}`}
              onClick={() => setSelectedRange("lastYear")}
            >
              Último ano (mensal)
            </Button>
          </div>
        </div>
        <div
          className="w-full"
          style={{ minHeight: "220px", height: "40vw", maxHeight: 450 }}
        >
          <MainChart data={chartData} />
        </div>
      </div>

      {/* Last Month Stat Cards - Without Percentages */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard
          title="Novos Alunos (Mês Passado)"
          value={dashboardData?.students?.previous?.toString() || "0"}
          description="Total de novos alunos no mês anterior"
        />
        <StatCard
          title="Diferença de Novos Alunos"
          value={
            (dashboardData?.students?.current || 0) -
              (dashboardData?.students?.previous || 0) >=
            0
              ? `+${(dashboardData?.students?.current || 0) - (dashboardData?.students?.previous || 0)}`
              : `${(dashboardData?.students?.current || 0) - (dashboardData?.students?.previous || 0)}`
          }
          description="Diferença entre este mês e o anterior"
        />
        <StatCard
          title="Receita (Mês Passado)"
          value={formatCurrency(dashboardData?.revenue?.previous || 0)}
          description="Receita total do mês anterior"
        />
      </div>
    </div>
  );
}
