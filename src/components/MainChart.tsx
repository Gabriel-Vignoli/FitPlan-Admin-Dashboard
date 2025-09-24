import React from "react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

function formatDatePtBR(dateString: string) {
  const date = new Date(dateString);

  if (dateString.length >= 7 && dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });
  }

  return date.toLocaleDateString("pt-BR");
}

interface MainChartProps {
  data: Array<{
    date: string;
    totalStudents: number;
    newStudents: number;
  }>;
}

export default function MainChart({ data }: MainChartProps) {
  return (
    <div
      className="w-full"
      style={{
        minHeight: "220px",
        height: "40vw",
        maxHeight: "450px",
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F8BD01" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#F8BD01" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tick={{ fill: "#d1d5db", fontSize: 10 }}
            tickFormatter={formatDatePtBR}
            minTickGap={2}
            interval="preserveStartEnd"
            height={32}
          />
          <YAxis tick={{ fill: "#d1d5db", fontSize: 10 }} width={32} />
          <CartesianGrid strokeDasharray="3 3" stroke="#23272f" opacity={0.3} />
          <Tooltip
            contentStyle={{
              background: "#23272f",
              border: "none",
              borderRadius: 8,
              color: "#fff",
              fontWeight: 500,
              fontSize: 12,
              padding: 8,
            }}
            labelStyle={{ color: "#fff", fontSize: 12 }}
            cursor={{ stroke: "#10b981", strokeWidth: 1, opacity: 0.2 }}
            labelFormatter={formatDatePtBR}
          />
          <Legend
            wrapperStyle={{ color: "#fff", fontSize: 12 }}
            iconSize={12}
          />
          <Area
            type="monotone"
            dataKey="totalStudents"
            name="Total de Alunos"
            stroke="#F8BD01"
            fill="url(#colorTotal)"
            strokeWidth={2}
            dot={{ r: 2.5, stroke: "#F8BD01", strokeWidth: 2, fill: "#fff" }}
            isAnimationActive={true}
          />
          <Area
            type="monotone"
            dataKey="newStudents"
            name="Novos Alunos"
            stroke="#3b82f6"
            fill="url(#colorNew)"
            strokeWidth={2}
            dot={{ r: 2.5, stroke: "#3b82f6", strokeWidth: 2, fill: "#fff" }}
            isAnimationActive={true}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
