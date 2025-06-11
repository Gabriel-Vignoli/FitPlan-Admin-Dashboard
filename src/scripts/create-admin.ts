import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../lib/auth'

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    const hashedPassword = await hashPassword('123456') 

    const admin = await prisma.admin.create({
      data: {
        name: 'Admin Principal',
        email: 'admin@academia.com',
        password: hashedPassword,
      }
    })

    console.log('✅ Admin criado com sucesso!')
    console.log('Email:', admin.email)
    console.log('Senha: 123456')
    console.log('Nome:', admin.name)
  } catch (error) {
    console.error('❌ Erro ao criar admin:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()