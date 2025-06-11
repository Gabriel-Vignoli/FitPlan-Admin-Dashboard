'use client'

import { useRouter, usePathname } from 'next/navigation'
import { AdminData } from '@/lib/auth'

interface SidebarProps {
  admin: AdminData
}

export default function Sidebar({ admin }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()

  const menuItems = [
    { name: 'Início', path: '/dashboard', icon: '🏠' },
    { name: 'Alunos', path: '/alunos', icon: '👥' },
    { name: 'Treinos', path: '/treinos', icon: '💪' },
    { name: 'Exercícios', path: '/exercicios', icon: '🏋️' },
    { name: 'Dietas', path: '/dietas', icon: '🥗' },
  ]

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  return (
    <div className="w-64 bg-white shadow-lg flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-indigo-600">🏋️ Academia</h2>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <button
                onClick={() => router.push(item.path)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  pathname === item.path
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Admin Info */}
      <div className="p-4 border-t">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">
              {admin.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{admin.name}</p>
            <p className="text-sm text-gray-500">{admin.email}</p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
        >
          Sair
        </button>
      </div>
    </div>
  )
}