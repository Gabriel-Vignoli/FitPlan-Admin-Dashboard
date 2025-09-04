import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
}

interface StudentSearchProps {
  onStudentSelect?: (student: Student) => void;
  onSearchResults?: (students: Student[]) => void;
  onSearchChange?: (query: string) => void; 
  placeholder?: string;
}

export default function StudentSearch({  
  onSearchResults,
  placeholder = "Buscar aluno por nome...", 
  onSearchChange = () => {}
}: StudentSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.length >= 2) {
        searchStudents();
      } else {
        onSearchResults?.([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const searchStudents = async () => {
    if (searchQuery.length < 2) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/alunos?q=${encodeURIComponent(searchQuery)}`);
      
      if (!response.ok) {
        throw new Error("Erro ao buscar alunos");
      }

      const data = await response.json();
      onSearchResults?.(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    onSearchResults?.([]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  setSearchQuery(value);

  onSearchChange?.(value); // Dispara sempre que digitar

  if (value.length === 0) {
    onSearchResults?.([]);
  }
};

  return (
    <div className="relative">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4 w-4 text-white/50" />
        </div>
        
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full rounded-[8px] border border-white/30 bg-[#151515] pl-10 pr-10 py-3 text-white placeholder-white/50 focus:border-white/50 focus:outline-none focus:ring-0 transition-colors"
        />
        
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-white/50 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="absolute top-full left-0 right-0 mt-1 rounded-[8px] border border-white/30 bg-[#151515] p-3 z-10">
          <div className="flex items-center gap-2 text-white/70">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white/70"></div>
            <span>Buscando alunos...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute top-full left-0 right-0 mt-1 rounded-[8px] border border-red-500/30 bg-red-500/10 p-3 z-10">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}