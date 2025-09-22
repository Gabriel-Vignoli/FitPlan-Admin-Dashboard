"use client";
import React from "react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface StatCardProps {
  title: string;
  value: string | number;
  percentage: string;
  chartData?: Array<{ value: number }>;
  chartColor?: string;
  isPositive?: boolean;
}
export default function StatCard(props: StatCardProps) {
  const {
    title,
    value,
    percentage,
    chartData = [],
    chartColor = "#10b981",
    isPositive = true,
  } = props;
  const defaultData = [
    { value: 20 },
    { value: 35 },
    { value: 25 },
    { value: 45 },
    { value: 60 },
    { value: 55 },
    { value: 70 },
    { value: 65 },
    { value: 80 },
    { value: 75 },
  ];
  const data = chartData.length > 0 ? chartData : defaultData;
  return (
    <div className="flex h-full flex-col rounded-xl border border-white/20 bg-gradient-to-br from-[#18181b] to-[#23272f] p-4 shadow-lg backdrop-blur-md sm:p-6">
      <h3 className="mb-2 text-sm font-medium text-white/90 sm:mb-4 sm:text-base md:text-lg">
        {title}
      </h3>

      <div className="flex flex-grow flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div className="flex flex-col">
          <p className="mb-1 text-xl font-bold text-white sm:mb-3 sm:text-2xl md:text-3xl lg:text-4xl">
            {value}
          </p>
          <div className="flex flex-col">
            <span
              className={`flex items-center gap-1 text-xs font-medium sm:text-sm ${
                isPositive ? "text-green-400" : "text-red-400"
              }`}
            >
              <span className="text-sm sm:text-base">
                {isPositive ? "↗" : "↘"}
              </span>
              {percentage.replace(/^\+?/, "")}
            </span>
            <span className="mt-1 text-xs text-gray-400 sm:text-sm">
              esse mês
            </span>
          </div>
        </div>

        <div className="h-16 w-full sm:h-20 sm:w-32 md:h-24 md:w-40 lg:h-28 lg:w-48 xl:w-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id={`gradient-${title.replace(/\s+/g, "")}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor={chartColor} stopOpacity={0.6} />
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={chartColor}
                strokeWidth={2}
                fill={`url(#gradient-${title.replace(/\s+/g, "")})`}
                dot={{ r: 3, stroke: chartColor, strokeWidth: 2, fill: "#fff" }}
                isAnimationActive={true}
              />
              <Tooltip
                contentStyle={{
                  background: "#23272f",
                  border: "none",
                  borderRadius: 8,
                  color: "#fff",
                  fontWeight: 500,
                }}
                labelStyle={{ color: "#fff" }}
                cursor={{ stroke: chartColor, strokeWidth: 1, opacity: 0.2 }}
              />
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#23272f"
                opacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
