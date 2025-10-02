"use client";
import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  percentage?: string;
  chartData?: Array<{ value: number }>;
  chartColor?: string;
  isPositive?: boolean;
  description?: string;
  arrow?: boolean;
}

export default function StatCard(props: StatCardProps) {
  const {
    title,
    value,
    percentage,
    isPositive = true,
    description,
    arrow = true
  } = props;

  return (
    <div className="flex h-full flex-col rounded-[8px] bg-gradient-to-br from-[#18181b] to-[#17191d] p-4 shadow-lg backdrop-blur-md sm:p-6">
      <h3 className="mb-2 text-sm font-medium text-white/90 sm:mb-4 sm:text-base md:text-lg">
        {title}
      </h3>
      <div className="flex flex-col">
        <p className="mb-1 text-xl font-bold text-white sm:mb-3 sm:text-2xl md:text-3xl lg:text-4xl">
          {value}
        </p>
        {description && (
          <span className="mb-2 text-xs text-gray-300 sm:text-sm">
            {description}
          </span>
        )}
        {arrow && percentage && (
          <>
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
            <span className="mt-1 text-xs text-gray-400 sm:text-sm">esse mês</span>
          </>
        )}
      </div>
    </div>
  );
}