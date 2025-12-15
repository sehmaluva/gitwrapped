"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface Language {
  name: string;
  color: string;
  percentage: number;
  size: number;
}

interface LanguageChartProps {
  languages: Language[];
}

export function LanguageChart({ languages }: LanguageChartProps) {
  // Transform data for Recharts
  const chartData = languages.map((lang) => ({
    name: lang.name,
    color: lang.color,
    percentage: lang.percentage,
    size: lang.size,
  }));

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-800">
      <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Top Languages</h3>
      <div className="h-48 sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={60}
              paddingAngle={2}
              dataKey="percentage"
              nameKey="name"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || "#6366f1"} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(value) => [`${value}%`, "Usage"]}
            />
            <Legend
              wrapperStyle={{ fontSize: "12px" }}
              formatter={(value) => (
                <span className="text-gray-300 text-xs sm:text-sm">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 sm:mt-4 space-y-1.5 sm:space-y-2">
        {languages.slice(0, 5).map((lang) => (
          <div key={lang.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: lang.color || "#6366f1" }}
              />
              <span className="text-gray-300 text-xs sm:text-sm truncate">{lang.name}</span>
            </div>
            <span className="text-gray-400 text-xs sm:text-sm flex-shrink-0 ml-2">{lang.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
