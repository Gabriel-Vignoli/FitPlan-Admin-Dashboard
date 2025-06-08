import { PrismaClient, PaymentStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.admin.create({
    data: {
      name: 'Gabriel Admin',
      email: 'admin@example.com',
      password: 'senha123',
      avatar: null,
    },
  })

  await prisma.plan.create({
    data: {
      name: 'Plano Básico',
      description: 'Plano básico para iniciantes',
      price: 99.99,
      duration: 30,
      isActive: true,
    },
  })

  const plan = await prisma.plan.findFirst({ where: { name: 'Plano Básico' } })

  if (!plan) throw new Error('Plano Básico não encontrado')

  await prisma.student.create({
    data: {
      name: 'Lucas Silva',
      email: 'lucas@example.com',
      password: 'senha123',
      phone: '11999999999',
      birthDate: new Date('1995-05-15'),
      cpf: '123.456.789-00',
      height: 1.75,
      weight: 70,
      bodyFat: 15,
      planId: plan.id,
      paymentStatus: PaymentStatus.PAID,
    },
  })

  await prisma.exercise.createMany({
    data: [
      {
        name: 'Supino Reto',
        targetMuscle: 'Peito',
        imageUrl: null,
        videoUrl: null,
      },
      {
        name: 'Agachamento',
        targetMuscle: 'Pernas',
        imageUrl: null,
        videoUrl: null,
      },
      {
        name: 'Rosca Direta',
        targetMuscle: 'Bíceps',
        imageUrl: null,
        videoUrl: null,
      },
    ],
  })

  const workout = await prisma.workout.create({
    data: {
      title: 'Treino Full Body',
      description: 'Treino para todo o corpo',
      isFavorite: true,
    },
  })

  const exercises = await prisma.exercise.findMany()

  for (let i = 0; i < exercises.length; i++) {
    await prisma.workoutExercise.create({
      data: {
        workoutId: workout.id,
        exerciseId: exercises[i].id,
        sets: 3,
        reps: '12',
        order: i + 1,
      },
    })
  }

  const student = await prisma.student.findFirst({ where: { email: 'lucas@example.com' } })

  if (!student) throw new Error('Aluno não encontrado')

  await prisma.studentWorkout.create({
    data: {
      studentId: student.id,
      workoutId: workout.id,
      dayOfWeek: 1, // Segunda-feira
      isActive: true,
    },
  })

  await prisma.monthlyStats.create({
    data: {
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      totalStudents: 1,
      newStudents: 1,
      revenue: 99.99,
    },
  })
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
