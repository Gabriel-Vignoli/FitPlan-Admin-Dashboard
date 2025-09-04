import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  formatDate,
  formatPhone,
  getInitials,
  getStatusStyle,
  getStatusText,
} from "@/lib/utils/formatters";
import { useRouter } from "next/navigation";

interface Aluno {
  id: string;
  name: string;
  phone: string;
  createdAt: string;
  paymentStatus: string;
  plan: {
    name: string;
  };
}

interface AlunosTableProps {
  alunos: Aluno[];
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSortChange?: (field: string) => void;
  getSortIcon?: (field: string) => React.ReactNode;
}

export default function AlunosTable({
  alunos,
  onSortChange,
  getSortIcon,
}: AlunosTableProps) {
  const router = useRouter();

  const handleNavigateToAluno = (alunoId: string) => {
    router.push(`/alunos/${alunoId}`);
  };

  const handleSort = (field: string) => {
    if (onSortChange) {
      onSortChange(field);
    }
  };

  if (alunos.length === 0) {
    return (
      <div className="rounded-[8px] border border-white/10 bg-[#151515] p-8 text-center">
        <p className="text-white/50">Nenhum aluno encontrado</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table - Hidden on mobile */}
      <div className="hidden overflow-x-auto md:block">
        <Table className="rounded-[8px] border border-white/20">
          <TableHeader className="bg-[#101010] text-white/70">
            <TableRow className="border-white/10 hover:bg-white/5">
              <TableHead
                className={`text-white/70 ${onSortChange ? "cursor-pointer hover:text-white" : ""}`}
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center space-x-1">
                  <span>NOME</span>
                  {getSortIcon && <span>{getSortIcon("name")}</span>}
                </div>
              </TableHead>
              <TableHead className="text-white/70">CELULAR</TableHead>
              <TableHead className="text-white/70">PLANO</TableHead>
              <TableHead
                className={`text-white/70 ${onSortChange ? "cursor-pointer hover:text-white" : ""}`}
                onClick={() => handleSort("createdAt")}
              >
                <div className="flex items-center space-x-1">
                  <span>DESDE</span>
                  {getSortIcon && <span>{getSortIcon("createdAt")}</span>}
                </div>
              </TableHead>
              <TableHead
                className={`text-white/70 ${onSortChange ? "cursor-pointer hover:text-white" : ""}`}
                onClick={() => handleSort("paymentStatus")}
              >
                <div className="flex items-center space-x-1">
                  <span>STATUS</span>
                  {getSortIcon && <span>{getSortIcon("paymentStatus")}</span>}
                </div>
              </TableHead>
              <TableHead className="text-white/70">GERENCIAR</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-[#151515]">
            {alunos.map((aluno) => (
              <TableRow
                key={aluno.id}
                className="border-white/10 hover:bg-white/5"
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-sm font-medium text-white">
                      {getInitials(aluno.name)}
                    </div>
                    <span className="text-white">{aluno.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-white/70">
                  {formatPhone(aluno.phone)}
                </TableCell>
                <TableCell className="cursor-pointer text-white/70 underline hover:text-white/90">
                  {aluno.plan.name}
                </TableCell>
                <TableCell className="text-white/70">
                  {formatDate(aluno.createdAt)}
                </TableCell>
                <TableCell>
                  <span
                    className={`rounded-full px-2 py-1 ${getStatusStyle(aluno.paymentStatus)}`}
                  >
                    {getStatusText(aluno.paymentStatus)}
                  </span>
                </TableCell>
                <TableCell>
                  <button
                    className="cursor-pointer text-blue-400 transition-colors hover:text-blue-300 hover:underline"
                    onClick={() => handleNavigateToAluno(aluno.id)}
                  >
                    Gerenciar
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards - Shown only on mobile */}
      <div className="space-y-4 md:hidden">
        {alunos.map((aluno) => (
          <div
            key={aluno.id}
            className="space-y-3 rounded-[8px] border border-white/20 bg-[#151515] p-4"
          >
            {/* Header with avatar and name */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 text-sm font-medium text-white">
                  {getInitials(aluno.name)}
                </div>
                <div>
                  <h3 className="font-medium text-white">{aluno.name}</h3>
                  <p className="text-sm text-white/70">
                    {formatPhone(aluno.phone)}
                  </p>
                </div>
              </div>
              <span
                className={`rounded-full px-2 py-1 text-xs ${getStatusStyle(aluno.paymentStatus)}`}
              >
                {getStatusText(aluno.paymentStatus)}
              </span>
            </div>

            {/* Details */}
            <div className="flex items-center justify-between text-sm">
              <div className="text-white/70">
                <p className="cursor-pointer text-white/70 underline hover:text-white/90">
                  {aluno.plan.name}
                </p>
                <span className="text-white/50">Desde: </span>
                {formatDate(aluno.createdAt)}
              </div>
              <button
                className="cursor-pointer font-medium text-blue-400 transition-colors hover:text-blue-300"
                onClick={() => handleNavigateToAluno(aluno.id)}
              >
                Gerenciar
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
