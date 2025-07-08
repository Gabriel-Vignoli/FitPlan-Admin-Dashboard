import Header from "@/components/Header";
import StatCard from "@/components/StatCard";
import { getCurrentAdmin } from "@/lib/auth";
import { Plus } from "lucide-react";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/login");
  }

  // Sample data for the charts (you can replace with real data)
  const totalUsersData = [
    { value: 120 },
    { value: 135 },
    { value: 125 },
    { value: 145 },
    { value: 160 },
    { value: 155 },
    { value: 170 },
    { value: 165 },
    { value: 174 },
    { value: 174 },
  ];

  const newUsersData = [
    { value: 20 },
    { value: 18 },
    { value: 22 },
    { value: 19 },
    { value: 17 },
    { value: 15 },
    { value: 18 },
    { value: 16 },
    { value: 14 },
    { value: 16 },
  ];

  return (
      <div className="p-8">
        <Header
          buttonText="Adicionar Aluno"
          buttonVariant="default"
          title={`Bem-vindo ${admin.name}`}
          description="Descubra padrões, otimize treinos e acompanhe o fluxo da academia!"
          icon={<Plus></Plus>}
          pageLink="/alunos/add"
        ></Header>

        {/* Estatísticas */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total de Usuários"
            value="174"
            percentage="12%"
            chartData={totalUsersData}
            chartColor="#10b981"
            isPositive={true}
          />

          <StatCard
            title="Novos Usuários"
            value="16"
            percentage="2%"
            chartData={newUsersData}
            chartColor="#ef4444"
            isPositive={false}
          />

          <div className="md:col-span-2 lg:col-span-1">
            <StatCard
              title="Lucro do Mês"
              value="7000"
              percentage="5%"
              chartData={totalUsersData}
              chartColor="#10b981"
              isPositive={true}
            />
          </div>
        </div>
      

      {/* Treinos Favoritos */}
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

      {/* Sobre os Alunos */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg bg-white shadow">
          <div className="border-b p-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Novos Alunos
            </h3>
          </div>
          <div className="p-6">
            <p className="text-gray-500">Nenhum aluno novo encontrado</p>
          </div>
        </div>

        <div className="rounded-lg bg-white shadow">
          <div className="border-b p-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Alunos Mais Fiéis
            </h3>
          </div>
          <div className="p-6">
            <p className="text-gray-500">Nenhum aluno encontrado</p>
          </div>
        </div>
      </div>
      </div>
  );
}
