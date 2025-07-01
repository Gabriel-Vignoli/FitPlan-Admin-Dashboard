import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'


// Find all users
export async function GET() {
    try {
        const alunos = await prisma.student.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        })
        
        return NextResponse.json(alunos)
    } catch (error) {
        console.error('Error fetching alunos:', error)
        return NextResponse.json({ error: 'Failed to fetch alunos' }, { status: 500 })
    }
}

// Function to generate password from birth date
function generatePasswordFromBirthDate(birthDate: string): string {
    const date = new Date(birthDate)
    
    // Format: DD/MM/YYYY (Portuguese format)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear().toString()
    
    return `${day}${month}${year}` 
}

// Create one User
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { name, email, phone, birthDate, cpf, planId } = body

        // Validation
        if (!name || !email || !phone || !birthDate || !cpf || !planId) {
            return NextResponse.json(
                { error: 'Todos os campos são obrigatórios' },
                { status: 400 }
            )
        }

        // Check if the user already exists
        const existingUser = await prisma.student.findUnique({
            where: { email }
        })

        if (existingUser) {
            return NextResponse.json(
                { error: 'Já há um usuário com esse email' },
                { status: 409 }
            )
        }

        // Check if the plan exists
        const existingPlan = await prisma.plan.findUnique({
            where: { id: planId }
        })

        if (!existingPlan) {
            return NextResponse.json(
                { error: 'Plano não encontrado' },
                { status: 404 }
            )
        }

        const password = generatePasswordFromBirthDate(birthDate)
        
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create new user
        await prisma.student.create({
            data: {
                name,
                email,
                phone,
                birthDate: new Date(birthDate),
                password: hashedPassword,
                cpf,
                planId, 
            }
        })

        return NextResponse.json(
            { message: 'Usuário criado com sucesso' },
            { status: 201 }
        )

    } catch (error) {
        console.error('Error creating user:', error)
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        )
    }
}