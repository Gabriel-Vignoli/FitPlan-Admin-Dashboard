import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonthNumber = today.getMonth();

    const thisMonthStart = new Date(currentYear, currentMonthNumber, 1);
    const lastMonthStart = new Date(currentYear, currentMonthNumber - 1, 1);

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

    // Calculate total revenue from active students
    const totalRevenueResult = (await prisma.$queryRaw`
    SELECT SUM(p.price) as total_revenue
    FROM "Student" s
    JOIN "Plan" p ON s."planId" = p.id
    WHERE s."isActive" = true
    AND (
    (s."createdAt" >= ${thisMonthStart}) 
    OR (s."updatedAt" >= ${thisMonthStart})
    OR (p."updatedAt" >= ${thisMonthStart})
  )
`) as [{ total_revenue: string | null }];

    const totalRevenue = Number(totalRevenueResult[0]?.total_revenue) || 0;

    // Calculate revenue from last month for comparison
    const lastMonthRevenueResult = (await prisma.$queryRaw`
      SELECT SUM(p.price) as total_revenue
      FROM "Student" s
      JOIN "Plan" p ON s."planId" = p.id
      WHERE s."isActive" = true
      AND s."createdAt" >= ${lastMonthStart}
      AND s."createdAt" < ${thisMonthStart}
    `) as [{ total_revenue: string | null }];

    const lastMonthRevenue =
      Number(lastMonthRevenueResult[0]?.total_revenue) || 0;

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

    function formatDate(date: Date) {
      return date.toISOString().split("T")[0];
    }

    // 1. This month, every 3 days
    const thisMonthHistory = [];
    for (
      let d = new Date(thisMonthStart);
      d <= today;
      d.setDate(d.getDate() + 3)
    ) {
      const periodStart = new Date(d);
      const periodEnd = new Date(periodStart);
      periodEnd.setDate(periodEnd.getDate() + 2);
      if (periodEnd > today) periodEnd.setTime(today.getTime());
      const newStudents = await prisma.student.count({
        where: {
          createdAt: {
            gte: periodStart,
            lt: new Date(periodEnd.getTime() + 24 * 60 * 60 * 1000),
          },
        },
      });
      const totalStudents = await prisma.student.count({
        where: {
          createdAt: { lte: periodEnd },
        },
      });
      thisMonthHistory.push({
        date: formatDate(periodStart),
        totalStudents,
        newStudents,
      });
    }

    // 2. Last 3 months, every 15 days
    const threeMonthsAgo = new Date(currentYear, currentMonthNumber - 2, 1);
    const last3MonthsHistory = [];
    for (
      let d = new Date(threeMonthsAgo);
      d <= today;
      d.setDate(d.getDate() + 15)
    ) {
      const periodStart = new Date(d);
      const periodEnd = new Date(periodStart);
      periodEnd.setDate(periodEnd.getDate() + 14);
      if (periodEnd > today) periodEnd.setTime(today.getTime());
      const newStudents = await prisma.student.count({
        where: {
          createdAt: {
            gte: periodStart,
            lt: new Date(periodEnd.getTime() + 24 * 60 * 60 * 1000),
          },
        },
      });
      const totalStudents = await prisma.student.count({
        where: {
          createdAt: { lte: periodEnd },
        },
      });
      last3MonthsHistory.push({
        date: formatDate(periodStart),
        totalStudents,
        newStudents,
      });
    }

    // 3. Last 1 year, monthly
    const oneYearAgo = new Date(currentYear - 1, currentMonthNumber, 1);
    const lastYearHistory = [];
    for (
      let m = new Date(oneYearAgo);
      m <= today;
      m.setMonth(m.getMonth() + 1)
    ) {
      const periodStart = new Date(m);
      const periodEnd = new Date(
        periodStart.getFullYear(),
        periodStart.getMonth() + 1,
        0,
      );
      if (periodEnd > today) periodEnd.setTime(today.getTime());
      const newStudents = await prisma.student.count({
        where: {
          createdAt: {
            gte: periodStart,
            lt: new Date(periodEnd.getTime() + 24 * 60 * 60 * 1000),
          },
        },
      });
      const totalStudents = await prisma.student.count({
        where: {
          createdAt: { lte: periodEnd },
        },
      });
      lastYearHistory.push({
        date: formatDate(periodStart),
        totalStudents,
        newStudents,
      });
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
      chartHistory: {
        thisMonth: thisMonthHistory,
        last3Months: last3MonthsHistory,
        lastYear: lastYearHistory,
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
