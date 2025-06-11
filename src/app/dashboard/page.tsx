import { getCurrentAdmin } from '@/lib/auth'
import Sidebar from '@/components/ui/Sidebar'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const admin = await getCurrentAdmin()
  
  if (!admin) {
    redirect('/login')
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar admin={admin} />
      
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Bem-vindo ao sistema de gerenciamento da academia</p>
            
            <button className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
              Adicionar Aluno
            </button>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">Total de Usuários</h3>
              <p className="text-3xl font-bold text-indigo-600 mt-2">0</p>
              <p className="text-sm text-gray-500 mt-1">+0% do mês passado</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">Novos Usuários</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">0</p>
              <p className="text-sm text-gray-500 mt-1">+0% do mês passado</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">Lucro do Mês</h3>
              <p className="text-3xl font-bold text-purple-600 mt-2">R$ 0,00</p>
              <p className="text-sm text-gray-500 mt-1">+0% do mês passado</p>
            </div>
          </div>

          {/* Treinos Favoritos */}
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Treinos Favoritos</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-500">Nenhum treino favorito encontrado</p>
            </div>
          </div>

          {/* Sobre os Alunos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Novos Alunos</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-500">Nenhum aluno novo encontrado</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Alunos Mais Fiéis</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-500">Nenhum aluno encontrado</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}