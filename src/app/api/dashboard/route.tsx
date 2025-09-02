import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonthNumber = today.getMonth();

    const thisMonthStart = new Date(currentYear, currentMonthNumber, 1);
    const lastMonthStart = new Date(currentYear, currentMonthNumber - 1, 1);

    // Student counts
    const studentsThisMonth = await prisma.student.count({
      where: {
        createdAt: { gte: thisMonthStart }, // gte = greater than or equal
      },
    });

    const studentsLastMonth = await prisma.student.count({
      where: {
        createdAt: {
          gte: lastMonthStart,
          lt: thisMonthStart, // lt = less than
        },
      },
    });

    const totalStudents = await prisma.student.count();

    // Calculate total revenue from active students this month
    const totalRevenueResult = await prisma.$queryRaw`
      SELECT SUM(p.price) as total_revenue
      FROM "Student" s
      JOIN "Plan" p ON s."planId" = p.id
      WHERE s."isActive" = true
      AND s."createdAt" >= ${thisMonthStart}
    ` as [{ total_revenue: string | null }];

    const totalRevenue = Number(totalRevenueResult[0]?.total_revenue) || 0;


    // Calculate revenue from last month for comparison
    const lastMonthRevenueResult = await prisma.$queryRaw`
      SELECT SUM(p.price) as total_revenue
      FROM "Student" s
      JOIN "Plan" p ON s."planId" = p.id
      WHERE s."isActive" = true
      AND s."createdAt" >= ${lastMonthStart}
      AND s."createdAt" < ${thisMonthStart}
    ` as [{ total_revenue: string | null }];

    const lastMonthRevenue = Number(lastMonthRevenueResult[0]?.total_revenue) || 0;

    // Calculate student change percentage
    let changePercentage = 0;
    if (studentsLastMonth === 0) {
      changePercentage = studentsThisMonth > 0 ? 100 : 0;
    } else {
      changePercentage =
        ((studentsThisMonth - studentsLastMonth) / studentsLastMonth) * 100;
    }

    // Calculate revenue change percentage
    let revenueChangePercentage = 0;
    if (lastMonthRevenue === 0) {
      revenueChangePercentage = totalRevenue > 0 ? 100 : 0;
    } else {
      revenueChangePercentage =
        ((totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;
    }

    const response = {
      students: {
        current: studentsThisMonth,
        previous: studentsLastMonth,
        total: totalStudents,
        changePercentage: Math.round(changePercentage),
      },
      revenue: {
        current: totalRevenue,
        previous: lastMonthRevenue,
        changePercentage: Math.round(revenueChangePercentage),
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Could not get dashboard data" },
      { status: 500 },
    );
  }
}