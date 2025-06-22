"use client";
import React from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface StatCardProps {
  title: string;
  value: string | number;
  percentage: string;
  chartData?: Array<{ value: number }>;
  chartColor?: string;
  isPositive?: boolean;
}

export default function StatCard({ 
  title, 
  value, 
  percentage, 
  chartData = [],
  chartColor = "#10b981",
  isPositive = true
}: StatCardProps) {
  
  const defaultData = [
    { value: 20 }, { value: 35 }, { value: 25 }, { value: 45 }, 
    { value: 60 }, { value: 55 }, { value: 70 }, { value: 65 }, 
    { value: 80 }, { value: 75 }
  ];

  const data = chartData.length > 0 ? chartData : defaultData;

  return (
    <div className="rounded-[8px] border border-white/30 bg-[#101010] backdrop-blur-sm p-4 sm:p-6 h-full flex flex-col">
      <h3 className="text-sm sm:text-base md:text-lg font-medium text-white/90 mb-2 sm:mb-4">
        {title}
      </h3>
      
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 flex-grow">
        <div className="flex flex-col">
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-3">
            {value}
          </p>
          <div className="flex flex-col">
            <span className={`text-xs sm:text-sm font-medium flex items-center gap-1 ${
              isPositive ? 'text-green-400' : 'text-red-400'
            }`}>
              <span className="text-sm sm:text-base">
                {isPositive ? '↗' : '↘'}
              </span>
              {percentage.replace(/^\+?/, '')}
            </span>
            <span className="text-xs sm:text-sm text-gray-400 mt-1">esse mês</span>
          </div>
        </div>
        
        <div className="w-full sm:w-32 md:w-40 lg:w-48 xl:w-56 h-12 sm:h-16 md:h-20 lg:h-24">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id={`gradient-${title.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColor} stopOpacity={0.4}/>
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={chartColor}
                strokeWidth={1.5}
                fill={`url(#gradient-${title.replace(/\s+/g, '')})`}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}