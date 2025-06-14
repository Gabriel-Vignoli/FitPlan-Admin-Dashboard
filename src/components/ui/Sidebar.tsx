"use client";

import { useRouter, usePathname } from "next/navigation";
import { AdminData } from "@/lib/auth";
import Image from "next/image";
import { Button } from "./button";
import { BicepsFlexed, Dumbbell, Home, Users } from "lucide-react";

interface SidebarProps {
  admin: AdminData;
}

export default function Sidebar({ admin }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { name: "Início", path: "/dashboard", icon: <Home></Home> },
    { name: "Alunos", path: "/alunos", icon: <Users></Users> },
    { name: "Treinos", path: "/treinos", icon: <BicepsFlexed></BicepsFlexed> },
    { name: "Exercícios", path: "/exercicios", icon: <Dumbbell></Dumbbell> },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <div className="flex w-64 flex-col border-r-1 border-white/30 bg-[#070707] shadow-lg space-y-3">
      {/* Logo */}
      <div className="flex items-center justify-center border-b border-white/30 p-4">
        <Image
          src="/gym-logo-name.svg"
          alt="Logo Acadenua"
          width={130}
          height={130}
        ></Image>
      </div>
      {/* Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-3">
          {menuItems.map((item) => (
            <li key={item.path}>
              <button
                onClick={() => router.push(item.path)}
                className={`flex w-full items-center space-x-3 rounded-[8px] px-4 py-4 text-left transition-colors ${
                  pathname === item.path ? "bg-primary" : "hover:bg-primary/60"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-[18px] font-semibold">{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Admin Info */}
      <div className="border-t border-white/30 p-4 mb-2">
        <div className="mb-2 flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500">
            <span className="font-semibold text-white">
              {admin.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-semibold">{admin.name}</p>
            <p className="text-sm text-white/40">{admin.email}</p>
          </div>
        </div>

        <Button
          onClick={handleLogout}
          variant="destructive"
          className="mt-4 w-full rounded-[8px]">
          Sair
        </Button>
      </div>
    </div>
  );
}
