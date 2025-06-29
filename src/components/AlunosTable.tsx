import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Aluno {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  paymentStatus: string;
}

interface AlunosTableProps {
  alunos: Aluno[];
}

export default function AlunosTable({ alunos }: AlunosTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-500/20 text-green-400";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400";
      case "unpaid":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "Pago";
      case "pending":
        return "Pendente";
      case "unpaid":
        return "Não Pago";
      default:
        return "Desconhecido";
    }
  };

  const getInitials = (name: string) => {
    const nameParts = name.split(" ");
    const firstInitial = nameParts[0]?.[0]?.toUpperCase() || "";
    const lastInitial =
      nameParts[nameParts.length - 1]?.[0]?.toUpperCase() || "";
    return firstInitial + (nameParts.length > 1 ? lastInitial : "");
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
              <TableHead className="text-white/70">NOME</TableHead>
              <TableHead className="text-white/70">EMAIL</TableHead>
              <TableHead className="text-white/70">DESDE</TableHead>
              <TableHead className="text-white/70">STATUS</TableHead>
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
                <TableCell className="text-white/70">{aluno.email}</TableCell>
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
                  <button className="text-blue-400 transition-colors hover:text-blue-300 hover:underline">
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
                  <p className="text-sm text-white/70">{aluno.email}</p>
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
                <span className="text-white/50">Desde: </span>
                {formatDate(aluno.createdAt)}
              </div>
              <button className="font-medium text-blue-400 transition-colors hover:text-blue-300">
                Gerenciar
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
