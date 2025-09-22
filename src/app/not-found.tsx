import { Dumbbell } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-white/10 flex items-center justify-center p-4 sm:p-6">
      {/* Main Container */}
      <div className="rounded-2xl sm:rounded-[2rem] shadow-2xl p-6 sm:p-8 md:p-12 max-w-4xl w-full mx-auto relative overflow-hidden">
        
        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 w-12 h-12 sm:w-16 sm:h-16 bg-primary/30 rounded-full animate-bounce flex items-center justify-center text-primary/70">
          <Dumbbell size={16} className="sm:hidden" />
          <Dumbbell size={20} className="hidden sm:block" />
        </div>
        <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 w-10 h-10 sm:w-12 sm:h-12 bg-primary/30 rounded-full animate-pulse flex items-center justify-center text-primary/70">
          <Dumbbell size={12} className="sm:hidden" />
          <Dumbbell size={15} className="hidden sm:block" />
        </div>
        

        {/* Error Content */}
        <div className="text-center py-8 sm:py-12">
          {/* 404 with Logo */}
          <div className="relative inline-block mb-6 sm:mb-8">
            <h1 className="text-[6rem] xs:text-[8rem] sm:text-[10rem] md:text-[12rem] lg:text-[16rem] font-black text-primary leading-none select-none">
              4
              <span className="relative inline-block mx-2 sm:mx-4">
                <span className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 xs:w-24 xs:h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 bg-primary rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
                    <Image 
                      src="/gym-icon.svg" 
                      width={40} 
                      height={40}
                      alt="Academia Logo"
                      className="xs:w-12 xs:h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24"
                    />
                  </div>
                </span>
                <span className="invisible">0</span>
              </span>
              4
            </h1>
          </div>

          {/* Error Message */}
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4 px-2">
            Página não encontrada
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-4">
            Desculpe, não conseguimos encontrar a página que você está procurando.
            A página pode ter sido movida ou removida.
          </p>

          {/* Back Button */}
          <Link
            href="/"
            className="inline-block bg-primary hover:bg-primary/80 text-gray-900 font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-full text-base sm:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg mx-4"
          >
            Voltar para o início
          </Link>
        </div>
      </div>
    </div>
  );
}