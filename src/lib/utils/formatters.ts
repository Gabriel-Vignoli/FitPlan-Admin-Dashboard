export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("pt-BR");
}

export function getStatusStyle(status: string): string {
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
}

export function getStatusText(status: string): string {
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
}

export function getInitials(name: string): string {
  const nameParts = name.split(" ");
  const firstInitial = nameParts[0]?.[0]?.toUpperCase() || "";
  const lastInitial = nameParts[nameParts.length - 1]?.[0]?.toUpperCase() || "";
  return firstInitial + (nameParts.length > 1 ? lastInitial : "");
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  } else if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }

  return phone;
}

 export function formatCPF(value: string): string {
    const numericValue = value.replace(/\D/g, '');
    
    // Apply CPF mask: 000.000.000-00
    if (numericValue.length <= 11) {
      return numericValue
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2');
    }
    return value;
  };
