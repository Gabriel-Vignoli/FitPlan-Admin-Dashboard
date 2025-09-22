import { Dumbbell } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-white/10 flex items-center justify-center p-6">
      {/* Main Container */}
      <div className="rounded-[2rem] shadow-2xl p-8 md:p-12 max-w-4xl w-full mx-auto relative overflow-hidden">
        
        {/* Decorative Elements */}
        <div className="absolute top-6 right-6 w-16 h-16 bg-primary/30 rounded-full animate-bounce flex items-center justify-center text-primary/70">
        <Dumbbell size={20}></Dumbbell></div>
        <div className="absolute bottom-6 left-6 w-12 h-12 bg-primary/30 rounded-full animate-pulse flex items-center justify-center text-primary/70"><Dumbbell size={15}></Dumbbell></div>
        

        {/* Error Content */}
        <div className="text-center py-12">
          {/* 404 with Logo */}
          <div className="relative inline-block mb-8">
            <h1 className="text-[12rem] md:text-[16rem] font-black text-primary leading-none select-none">
              4
              <span className="relative inline-block mx-4">
                <span className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 md:w-40 md:h-40 bg-primary rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
                    <Image 
                      src="/gym-icon.svg" 
                      width={80} 
                      height={80} 
                      alt="Academia Logo"
                      className="md:w-24 md:h-24"
                    />
                  </div>
                </span>
                <span className="invisible">0</span>
              </span>
              4
            </h1>
          </div>

          {/* Error Message */}
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Página não encontrada
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Desculpe, não conseguimos encontrar a página que você está procurando.
            A página pode ter sido movida ou removida.
          </p>

          {/* Back Button */}
          <Link
            href="/"
            className="inline-block bg-primary hover:bg-primary/80 text-gray-900 font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            Voltar para o início
          </Link>
        </div>
      </div>
    </div>
  );
}