// scripts/create-exercises.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const gruposMusculares = [
  "Peito",
  "Costas",
  "Pernas",
  "Ombros",
  "Bíceps",
  "Tríceps",
  "Abdômen",
  "Glúteos",
  "Panturrilha",
];

const exerciciosPorGrupo: Record<string, string[]> = {
  Peito: [
    "Supino reto",
    "Supino inclinado",
    "Crucifixo",
    "Peck Deck",
    "Crossover",
  ],
  Costas: [
    "Puxada frente",
    "Remada curvada",
    "Remada baixa",
    "Barra fixa",
    "Pulldown",
  ],
  Pernas: [
    "Agachamento livre",
    "Leg press",
    "Cadeira extensora",
    "Cadeira flexora",
    "Stiff",
  ],
  Ombros: [
    "Desenvolvimento",
    "Elevação lateral",
    "Elevação frontal",
    "Remada alta",
    "Crucifixo inverso",
  ],
  Bíceps: [
    "Rosca direta",
    "Rosca alternada",
    "Rosca martelo",
    "Rosca concentrada",
    "Rosca Scott",
  ],
  Tríceps: [
    "Tríceps testa",
    "Tríceps corda",
    "Tríceps banco",
    "Tríceps francês",
    "Tríceps pulley",
  ],
  Abdômen: [
    "Abdominal supra",
    "Abdominal infra",
    "Prancha",
    "Abdominal oblíquo",
    "Abdominal máquina",
  ],
  Glúteos: [
    "Elevação de quadril",
    "Cadeira abdutora",
    "Cadeira adutora",
    "Avanço",
    "Agachamento sumô",
  ],
  Panturrilha: [
    "Elevação de panturrilha sentado",
    "Elevação de panturrilha em pé",
    "Panturrilha no leg press",
    "Panturrilha unilateral",
  ],
  Trapézio: [
    "Encolhimento de ombros",
    "Remada alta com barra",
    "Remada alta com halteres",
    "Face pull",
  ],
};

async function main() {
  for (const grupo of gruposMusculares) {
    for (const nome of exerciciosPorGrupo[grupo]) {
      await prisma.exercise.create({
        data: {
          name: nome,
          targetMuscle: grupo,
          imageUrl: "",
          videoUrl: "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });
    }
  }
  console.log("Exercícios criados com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
