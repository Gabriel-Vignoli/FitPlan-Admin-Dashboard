import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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

