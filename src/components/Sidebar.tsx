"use client";

import { useRouter, usePathname } from "next/navigation";
import { AdminData } from "@/lib/auth";
import Image from "next/image";
import { Button } from "./ui/button";
import { BicepsFlexed, Dumbbell, Home, Users, Menu, X, Diamond, ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { useState, useEffect } from "react";

interface SidebarProps {
  admin: AdminData;
}

export default function Sidebar({ admin }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const menuItems = [
    { name: "Início", path: "/dashboard", icon: <Home size={20} /> },
    { name: "Alunos", path: "/alunos", icon: <Users size={20} /> },
    { name: "Treinos", path: "/treinos", icon: <BicepsFlexed size={20} /> },
    { name: "Exercícios", path: "/exercicios", icon: <Dumbbell size={20} /> },
    { name: 'Planos', path: "/planos", icon: <Diamond size={20} /> }
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
    setIsMobileMenuOpen(false);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Navigate to profile when clicking on avatar
  const handleAvatarClick = () => {
    handleMenuItemClick('/perfil');
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


  const AdminAvatar = ({ size, clickable = false }: { size: number; clickable?: boolean }) => {
    const avatarElement = admin.avatar ? (
      <div className={`relative rounded-full overflow-hidden bg-indigo-500 transition-all duration-200 ${
        clickable ? 'hover:opacity-80 cursor-pointer' : ''
      }`} style={{ width: size, height: size }}>
        <Image
          src={admin.avatar}
          alt={`Avatar de ${admin.name}`}
          width={size}
          height={size}
          className="object-cover"
        />
      </div>
    ) : (
      <div 
        className={`flex items-center justify-center rounded-full bg-indigo-500 transition-all duration-200 ${
          clickable ? 'hover:bg-indigo-600 cursor-pointer' : ''
        }`}
        style={{ width: size, height: size }}
      >
        <span className="font-semibold text-white" style={{ fontSize: size * 0.4 }}>
          {admin.name.charAt(0).toUpperCase()}
        </span>
      </div>
    );

    return clickable ? (
      <button onClick={handleAvatarClick} className="focus:outline-none focus:ring-2 focus:ring-primary rounded-full">
        {avatarElement}
      </button>
    ) : (
      avatarElement
    );
  };

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={`flex flex-col border-r border-white/30 bg-[#070707] shadow-lg h-full transition-all duration-300 ease-in-out ${
      isMobile ? 'w-64' : isCollapsed ? 'w-20' : 'w-64'
    }`}>
      {/* Logo */}
      <div className={`flex items-center justify-center border-b border-white/30 transition-all duration-300 ${
        !isMobile && isCollapsed ? 'p-3' : 'p-4'
      }`}>
        {!isMobile && isCollapsed ? (
          <button
            onClick={() => handleMenuItemClick('/dashboard')}
            className="w-10 h-10 flex items-center justify-center transition-all duration-300 hover:bg-white/10 rounded-lg"
          >
            <Image
              src="/gym-icon.svg"
              alt="Logo Acadenua"
              width={32}
              height={32}
              className="transition-all duration-300 hover:scale-110"
            />
          </button>
        ) : (
          <button
            onClick={() => handleMenuItemClick('/dashboard')}
            className="transition-all duration-300 hover:opacity-80 rounded-lg"
          >
            <Image
              src="/gym-logo-name.svg"
              alt="Logo Acadenua"
              width={130}
              height={130}
              className="transition-all duration-300"
            />
          </button>
        )}
      </div>

      {/* Collapse Toggle Button - Only on desktop */}
      {!isMobile && (
        <div className={`flex justify-center transition-all duration-300 ${
          isCollapsed ? 'px-2 py-2' : 'px-2 py-3'
        }`}>
          <Button
            onClick={toggleCollapse}
            variant="ghost"
            size="sm"
            className={`rounded-[8px] text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 ${
              isCollapsed ? 'w-12 h-10' : 'w-full h-10'
            }`}
            title={isCollapsed ? 'Expandir sidebar' : 'Minimizar sidebar'}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            {!isCollapsed && <span className="ml-2">Minimizar</span>}
          </Button>
        </div>
      )}

      {/* Menu */}
      <nav className={`flex-1 transition-all duration-300 ${
        !isMobile && isCollapsed ? 'px-2 py-2' : 'p-4'
      }`}>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <div 
                className="relative"
                onMouseEnter={() => !isMobile && isCollapsed && setHoveredItem(item.path)}
                onMouseLeave={() => !isMobile && isCollapsed && setHoveredItem(null)}
              >
                <button
                  onClick={() => handleMenuItemClick(item.path)}
                  className={`flex w-full items-center rounded-[8px] transition-all duration-200 cursor-pointer group relative ${
                    pathname === item.path 
                      ? "bg-primary text-white shadow-lg" 
                      : "hover:bg-primary/60 text-white/80 hover:text-white"
                  } ${
                    !isMobile && isCollapsed 
                      ? 'justify-center p-3 h-12' 
                      : 'space-x-3 px-4 py-3 h-12'
                  }`}
                >
                  <span className={`transition-all duration-200 ${
                    pathname === item.path ? 'text-white' : 'text-white/80 group-hover:text-white'
                  }`}>
                    {item.icon}
                  </span>
                  {(isMobile || !isCollapsed) && (
                    <span className="text-[16px] font-medium tracking-wide">{item.name}</span>
                  )}
                  
                  {/* Active indicator for collapsed state */}
                  {!isMobile && isCollapsed && pathname === item.path && (
                    <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-white rounded-r-md" />
                  )}
                </button>
                
                {/* Enhanced tooltip for collapsed state */}
                {!isMobile && isCollapsed && hoveredItem === item.path && (
                  <div className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 z-50">
                    <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg border border-white/10 whitespace-nowrap">
                      {item.name}
                      {/* Tooltip arrow */}
                      <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-r-4 border-r-gray-900" />
                    </div>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </nav>

      {/* Admin Info */}
      <div className={`border-t border-white/30 transition-all duration-300 ${
        !isMobile && isCollapsed ? 'p-3' : 'p-4'
      }`}>
        {!isMobile && isCollapsed ? (
          <div className="flex flex-col items-center space-y-3">
            <AdminAvatar size={48} clickable={true} />
            <Button
              onClick={handleLogout}
              variant="destructive"
              size="sm"
              className="w-12 h-10 rounded-[8px] px-0 hover:bg-red-600 transition-all duration-200"
              title="Sair da conta"
            >
              <LogOut size={16} />
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-3 flex items-center space-x-3">
              <AdminAvatar size={48} clickable={true} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white truncate">{admin.name}</p>
                <p className="text-sm text-white/60 truncate">{admin.email}</p>
              </div>
            </div>

            <Button
              onClick={handleLogout}
              variant="destructive"
              className="w-full rounded-[8px] h-10 hover:bg-red-600 transition-all duration-200"
            >
              <LogOut size={16} className="mr-2" />
              Sair
            </Button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Hamburger Menu Button - Only visible on mobile */}
      <button
        id="hamburger-button"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-[8px] bg-[#070707] text-white border border-white/30 md:hidden hover:bg-[#0a0a0a] transition-colors duration-200"
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
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Sidebar */}
          <div
            id="mobile-sidebar"
            className={`absolute left-0 top-0 h-full transform transition-transform duration-300 ease-in-out ${
              isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <SidebarContent isMobile={true} />
          </div>
        </div>
      )}
    </>
  );
}