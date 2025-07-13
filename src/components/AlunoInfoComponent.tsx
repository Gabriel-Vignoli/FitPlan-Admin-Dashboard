import React from 'react';
import { User, Mail, Phone, CreditCard, Calendar, Ruler, Weight, Activity, DollarSign, Shield, Clock, FileText, Package } from 'lucide-react';
import { formatCPF, formatPhone, getInitials, getStatusStyle, getStatusText } from '@/lib/utils/formatters';

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
}

interface Plan {
  id: string;
  name: string;
  price: number;
  duration: number;
  description: number;
}

interface StudentInfoProps {
  student: Student;
  plan: Plan;
}

const StudentInfoComponent: React.FC<StudentInfoProps> = ({ student, plan }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-indigo-600 border-4 border-gray-200 flex items-center justify-center">
            <span className="text-white text-3xl font-bold">
              {getInitials(student.name)}
            </span>
          </div>
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold mb-2">{student.name}</h1>
          <div className="flex flex-col md:flex-row gap-2 mb-4">
            <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
              {plan?.name || 'Plano não encontrado'}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(student.paymentStatus)}`}>
              {getStatusText(student.paymentStatus)}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              student.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {student.isActive ? 'Ativo' : 'Inativo'}
            </span>
          </div>
          <div className="text-sm">
            <p className='text-white/90'>Criado em: {formatDate(student.createdAt)}</p>
            <p className='text-white/70'>ID: {student.id}</p>
          </div>
        </div>
      </div>

      {/* Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <div className="bg-[#060606] p-4 rounded-[8px] border border-white/30">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <User className="w-6 h-6 text-green-600" />
            Informações Pessoais
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              <span className="text-sm text-white/80">Email:</span>
              <span className="text-sm font-medium">{student.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" />
              <span className="text-sm text-white/80">Telefone:</span>
              <span className="text-sm font-medium">{formatPhone(student.phone)}</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" />
              <span className="text-sm text-white/80">CPF:</span>
              <span className="text-sm font-medium">{formatCPF(student.cpf)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-sm text-white/80">Data de Nascimento:</span>
              <span className="text-sm font-medium">{formatDate(student.birthDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm text-white/80">Status da Conta:</span>
              <span className={`text-sm font-medium ${
                student.isActive ? 'text-green-600' : 'text-red-600'
              }`}>
                {student.isActive ? 'Ativa' : 'Inativa'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-primary" />
              <span className="text-sm text-white/80">Pagamento:</span>
              <span className={`text-sm font-medium ${
                student.paymentStatus.toLowerCase() === 'paid' ? 'text-green-600' : 
                student.paymentStatus.toLowerCase() === 'pending' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {getStatusText(student.paymentStatus)}
              </span>
            </div>
          </div>
        </div>

        {/* Physical Informations */}
        <div className="bg-[#060606] p-4 rounded-[8px] border border-white/30">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Activity className="w-6 h-6 text-purple-600" />
            Status & Físico
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Ruler className="w-4 h-4 text-primary" />
              <span className="text-sm text-white/80">Altura:</span>
              <span className="text-sm font-medium">
                {student.height ? `${student.height}m` : 'Não informado'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Weight className="w-4 h-4 text-primary" />
              <span className="text-sm text-white/80">Peso:</span>
              <span className="text-sm font-medium">
                {student.weight ? `${student.weight}kg` : 'Não informado'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              <span className="text-sm text-white/80">Gordura Corporal:</span>
              <span className="text-sm font-medium">
                {student.bodyFat ? `${student.bodyFat}%` : 'Não informado'}
              </span>
            </div>
          </div>
        </div>

        {/* Plan Information */}
        <div className="bg-[#060606] p-4 rounded-[8px] border border-white/30">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Package className="w-6 h-6 text-orange-600" />
            Informações do Plano
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-white/80">Nome:</span>
              <span className="text-sm font-medium">
                {plan.name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-white/80">Preço:</span>
              <span className="text-sm font-medium">
                {new Intl.NumberFormat('pt-BR', { 
                  style: 'currency', 
                  currency: 'BRL' 
                }).format(plan.price)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-white/80">Duração:</span>
              <span className="text-sm font-medium">
                {plan.duration} dias
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-white/80">Descrição:</span>
              <span className="text-sm font-medium">
                {plan.description}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Actions */}
      <div className="mt-8 flex flex-wrap gap-3 justify-center md:justify-start">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Mail className="w-4 h-4" />
          Enviar Email
        </button>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
          <User className="w-4 h-4" />
          Editar Perfil
        </button>
      </div>
    </div>
  );
};

export default StudentInfoComponent;