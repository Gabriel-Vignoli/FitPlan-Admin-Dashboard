// Function to generate 6-character password (3 numbers + 3 letters)
export function generateSecurePassword(): string {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    
    let password = "";
    
    for (let i = 0; i < 3; i++) {
        password += letters[Math.floor(Math.random() * letters.length)];
    }
    
    for (let i = 0; i < 3; i++) {
        password += numbers[Math.floor(Math.random() * numbers.length)];
    }
    
    return password.split('').sort(() => Math.random() - 0.5).join('');
}


// Function to validated email 
export function isValidEmail(email: string): boolean {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailPattern.test(email)
}


// Function to validated phone number
export function isValidPhone(phone: string): boolean {
  const cleanPhone = phone.replace(/\D/g, '');

  return cleanPhone.length === 11;
}

// Function to validated CPF
export function isValidCPF(cpf: string): boolean {
  const cleanCPF = cpf.replace(/\D/g, '')
  
  if (cleanCPF.length !== 11 || /^(\d)\1{10}$/.test(cleanCPF)) {
    return false
  }
  
  function calculateDigit(digits: string, weights: number[]): number {
    const sum = digits
      .split('')
      .reduce((acc, digit, index) => acc + parseInt(digit) * weights[index], 0)
    
    const remainder = sum % 11
    return remainder < 2 ? 0 : 11 - remainder
  }
  
  const firstDigit = calculateDigit(cleanCPF.slice(0, 9), [10, 9, 8, 7, 6, 5, 4, 3, 2])
  if (firstDigit !== parseInt(cleanCPF[9])) return false
   
  const secondDigit = calculateDigit(cleanCPF.slice(0, 10), [11, 10, 9, 8, 7, 6, 5, 4, 3, 2])
  if (secondDigit !== parseInt(cleanCPF[10])) return false
  
  return true
}

// Validate Brazilian birth date in dd/mm/yyyy format
export function validateBirthDateBR(dateStr: string): { valid: boolean; error?: string; date?: Date } {
  if (!dateStr || typeof dateStr !== "string") {
    return { valid: false, error: "Data inválida" };
  }

  const match = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) {
    return { valid: false, error: "Formato de data inválido. Use dd/mm/aaaa" };
  }

  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10) - 1; 
  const year = parseInt(match[3], 10);

  const date = new Date(year, month, day);

  if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
    return { valid: false, error: "Data inválida" };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const candidate = new Date(date.getTime());
  candidate.setHours(0, 0, 0, 0);

  if (candidate > today) {
    return { valid: false, error: "Data não pode ser no futuro" };
  }

  let age = today.getFullYear() - year;
  const m = today.getMonth() - month;
  if (m < 0 || (m === 0 && today.getDate() < day)) {
    age--;
  }

  if (age > 100) {
    return { valid: false, error: "Idade não pode ser maior que 100 anos" };
  }

  if (age < 0) {
    return { valid: false, error: "Data inválida" };
  }

  return { valid: true, date };
}