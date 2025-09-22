import { prisma } from "../src/lib/prisma";

async function updateStudentPaymentStatuses() {
  const now = new Date();
  const students = await prisma.student.findMany();

  for (const student of students) {
    if (student.paymentStatus === "PAID") {
      const paidDate = new Date(student.paymentStatusUpdatedAt);
      const oneMonthAgo = new Date(now);
      oneMonthAgo.setMonth(now.getMonth() - 1);
      if (paidDate <= oneMonthAgo) {
        await prisma.student.update({
          where: { id: student.id },
          data: {
            paymentStatus: "PENDING",
            paymentStatusUpdatedAt: now,
          },
        });
        continue;
      }
    }
    if (student.paymentStatus === "PENDING") {
      const pendingDate = new Date(student.paymentStatusUpdatedAt);
      const twoDaysAgo = new Date(now);
      twoDaysAgo.setDate(now.getDate() - 2);
      if (pendingDate <= twoDaysAgo) {
        await prisma.student.update({
          where: { id: student.id },
          data: {
            paymentStatus: "UNPAID",
            paymentStatusUpdatedAt: now,
          },
        });
      }
    }
  }
}

updateStudentPaymentStatuses()
  .then(() => {
    console.log("Student payment statuses updated.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error updating payment statuses:", err);
    process.exit(1);
  });
