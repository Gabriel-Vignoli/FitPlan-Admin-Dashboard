import Header from "@/components/Header";
import { getCurrentAdmin } from "@/lib/auth";
import { Plus } from "lucide-react";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/DashboardClient";

export default async function DashboardPage() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/login");
  }

  return (
    <div className="p-8">
      <Header
        buttonText="Adicionar Aluno"
        buttonVariant="default"
        title={`Bem-vindo ${admin.name}`}
        description="Descubra padrões, otimize treinos e acompanhe o fluxo da academia!"
        icon={<Plus />}
        pageLink="/alunos"
      />
      
      {/* Pass the work to client component */}
      <DashboardClient />
    </div>
  );
}
