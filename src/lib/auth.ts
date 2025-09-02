import jwt, { JwtPayload } from 'jsonwebtoken' 
import bcrypt from 'bcryptjs' 
import { cookies } from 'next/headers' 
import { SignJWT, jwtVerify } from 'jose' 

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const secret = new TextEncoder().encode(JWT_SECRET)

export interface AdminData {
  id: string
  name: string
  email: string
}

interface AdminJwtPayload extends JwtPayload {
  id: string
  email: string
  name: string
}

// Criptografa uma senha usando bcrypt com fator de custo 12
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

// Compara uma senha com seu hash
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Gera um token JWT com dados do admin (para rotas API - Node.js runtime)
export function generateToken(adminData: AdminData): string {
  return jwt.sign(
    { 
      id: adminData.id, 
      email: adminData.email,
      name: adminData.name 
    },
    JWT_SECRET,
    { expiresIn: '7d' } // Token expira em 7 dias
  )
}

// Gera um token JWT usando a biblioteca jose (para middleware - Edge runtime)
export async function generateTokenEdge(adminData: AdminData): Promise<string> {
  return await new SignJWT({
    id: adminData.id,
    email: adminData.email,
    name: adminData.name
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt() 
    .setExpirationTime('7d') 
    .sign(secret) 
}

// Verifica e decodifica um token JWT (Node.js runtime)
export function verifyToken(token: string): AdminData | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminJwtPayload
    return {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name
    }
  } catch {
    return null 
  }
}

// Verifica e decodifica um token JWT (Edge runtime)
export async function verifyTokenEdge(token: string): Promise<AdminData | null> {
  try {
    const { payload } = await jwtVerify(token, secret)
    return {
      id: payload.id as string,
      email: payload.email as string,
      name: payload.name as string
    }
  } catch {
    return null 
  }
}

// Recupera o token de autenticação armazenado nos cookies
export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')
  return token?.value || null
}

// Obtém os dados do admin atual com base no token armazenado nos cookies
export async function getCurrentAdmin(): Promise<AdminData | null> {
  const token = await getAuthToken()
  if (!token) return null
  
  // Usa a função de verificação do runtime Node.js
  return verifyToken(token)
}
