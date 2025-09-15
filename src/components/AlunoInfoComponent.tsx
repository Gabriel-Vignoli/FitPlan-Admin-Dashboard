import React from "react";
import Image from "next/image";
import {
  User,
  Mail,
  Phone,
  CreditCard,
  Calendar,
  Ruler,
  Weight,
  Activity,
  DollarSign,
  Shield,
  Clock,
  FileText,
  Package,
} from "lucide-react";
import {
  formatCPF,
  formatPhone,
  getInitials,
  getStatusStyle,
  getStatusText,
} from "@/lib/utils/formatters";

interface Student {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  birthDate: string;
  cpf: string;
  height: number | null;
  weight: number | null;
  bodyFat: number | null;
  isActive: boolean;
  planId: string;
  paymentStatus: string;
  createdAt: string;
  avatar?: string;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  duration: number;
  description: string;
}

interface StudentInfoProps {
  student: Student;
  plan?: Plan | null;
}

const StudentInfoComponent: React.FC<StudentInfoProps> = ({
  student,
  plan,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      {/* Header Section */}
      <div className="mb-8 flex flex-col items-center gap-6 md:flex-row md:items-start">
        <div className="relative">
          {student.avatar ? (
            <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-gray-200 bg-indigo-600 overflow-hidden">
              <Image
                src={student.avatar}
                alt={student.name}
                width={128}
                height={128}
                className="rounded-full object-cover"
              />
            </div>
          ) : (
            <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-gray-200 bg-indigo-600">
              <span className="text-3xl font-bold text-white">
                {getInitials(student.name)}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 text-center md:text-left">
          <h1 className="mb-2 text-3xl font-bold">{student.name}</h1>
          <div className="mb-4 flex flex-col gap-2 md:flex-row">
            <span className="bg-primary/20 text-primary rounded-full px-3 py-1 text-sm font-medium">
              {plan?.name || "Plano não encontrado"}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusStyle(student.paymentStatus)}`}
            >
              {getStatusText(student.paymentStatus)}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                student.isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {student.isActive ? "Ativo" : "Inativo"}
            </span>
          </div>
          <div className="text-sm">
            <p className="text-white/90">
              Criado em: {formatDate(student.createdAt)}
            </p>
            <p className="text-white/70">ID: {student.id}</p>
          </div>
        </div>
      </div>

      {/* Information Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Personal Information */}
        <div className="rounded-[8px] border border-white/30 bg-[#060606] p-4">
          <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
            <User className="h-6 w-6 text-green-600" />
            Informações Pessoais
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Mail className="text-primary h-4 w-4" />
              <span className="text-sm text-white/80">Email:</span>
              <span className="text-sm font-medium">{student.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="text-primary h-4 w-4" />
              <span className="text-sm text-white/80">Telefone:</span>
              <span className="text-sm font-medium">
                {formatPhone(student.phone)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="text-primary h-4 w-4" />
              <span className="text-sm text-white/80">CPF:</span>
              <span className="text-sm font-medium">
                {formatCPF(student.cpf)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="text-primary h-4 w-4" />
              <span className="text-sm text-white/80">Data de Nascimento:</span>
              <span className="text-sm font-medium">
                {formatDate(student.birthDate)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="text-primary h-4 w-4" />
              <span className="text-sm text-white/80">Status da Conta:</span>
              <span
                className={`text-sm font-medium ${
                  student.isActive ? "text-green-600" : "text-red-600"
                }`}
              >
                {student.isActive ? "Ativa" : "Inativa"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="text-primary h-4 w-4" />
              <span className="text-sm text-white/80">Pagamento:</span>
              <span
                className={`text-sm font-medium ${
                  student.paymentStatus.toLowerCase() === "paid"
                    ? "text-green-600"
                    : student.paymentStatus.toLowerCase() === "pending"
                      ? "text-yellow-600"
                      : "text-red-600"
                }`}
              >
                {getStatusText(student.paymentStatus)}
              </span>
            </div>
          </div>
        </div>

        {/* Physical Informations */}
        <div className="rounded-[8px] border border-white/30 bg-[#060606] p-4">
          <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
            <Activity className="h-6 w-6 text-purple-600" />
            Status & Físico
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Ruler className="text-primary h-4 w-4" />
              <span className="text-sm text-white/80">Altura:</span>
              <span className="text-sm font-medium">
                {student.height ? `${student.height}m` : "Não informado"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Weight className="text-primary h-4 w-4" />
              <span className="text-sm text-white/80">Peso:</span>
              <span className="text-sm font-medium">
                {student.weight ? `${student.weight}kg` : "Não informado"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="text-primary h-4 w-4" />
              <span className="text-sm text-white/80">Gordura Corporal:</span>
              <span className="text-sm font-medium">
                {student.bodyFat ? `${student.bodyFat}%` : "Não informado"}
              </span>
            </div>
          </div>
        </div>

        {/* Plan Information */}
        <div className="rounded-[8px] border border-white/30 bg-[#060606] p-4">
          <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
            <Package className="h-6 w-6 text-orange-600" />
            Informações do Plano
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-orange-400" />
              <span className="text-sm text-white/80">Nome:</span>
              <span className="text-sm font-medium">
                {plan?.name || "Não informado"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-orange-400" />
              <span className="text-sm text-white/80">Preço:</span>
              <span className="text-sm font-medium">
                {plan?.price
                  ? new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(plan.price)
                  : "Não informado"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-400" />
              <span className="text-sm text-white/80">Duração:</span>
              <span className="text-sm font-medium">
                {plan?.duration ? `${plan.duration} dias` : "Não informado"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-orange-400" />
              <span className="text-sm text-white/80">Descrição:</span>
              <span className="text-sm font-medium">
                {plan?.description || "Não informado"}
              </span>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default StudentInfoComponent;
