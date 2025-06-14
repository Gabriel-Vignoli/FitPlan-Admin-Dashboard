"use client";

import { useRouter, usePathname } from "next/navigation";
import { AdminData } from "@/lib/auth";
import Image from "next/image";
import { Button } from "./ui/button";
import { BicepsFlexed, Dumbbell, Home, Users, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

interface SidebarProps {
  admin: AdminData;
}

export default function Sidebar({ admin }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const handleMenuItemClick = (path: string) => {
    router.push(path);
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('mobile-sidebar');
      const hamburger = document.getElementById('hamburger-button');
      
      if (
        isMobileMenuOpen &&
        sidebar &&
        !sidebar.contains(event.target as Node) &&
        hamburger &&
        !hamburger.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const SidebarContent = () => (
    <div className="flex w-64 flex-col border-r-1 border-white/30 bg-[#070707] shadow-lg space-y-3 h-full">
      {/* Logo */}
      <div className="flex items-center justify-center border-b border-white/30 p-4">
        <Image
          src="/gym-logo-name.svg"
          alt="Logo Acadenua"
          width={130}
          height={130}
        />
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-3">
          {menuItems.map((item) => (
            <li key={item.path}>
              <button
                onClick={() => handleMenuItemClick(item.path)}
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
          className="mt-4 w-full rounded-[8px]"
        >
          Sair
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Hamburger Menu Button - Only visible on mobile */}
      <button
        id="hamburger-button"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-[#070707] text-white border border-white/30 md:hidden"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden md:block">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Background overlay */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Sidebar */}
          <div
            id="mobile-sidebar"
            className={`absolute left-0 top-0 h-full transform transition-transform duration-300 ease-in-out ${
              isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}