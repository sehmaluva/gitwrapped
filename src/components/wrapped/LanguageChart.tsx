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
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
      <h3 className="text-xl font-bold text-white mb-4">Top Languages</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
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
              }}
              formatter={(value) => [`${value}%`, "Usage"]}
            />
            <Legend
              formatter={(value) => (
                <span className="text-gray-300">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 space-y-2">
        {languages.slice(0, 5).map((lang) => (
          <div key={lang.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: lang.color || "#6366f1" }}
              />
              <span className="text-gray-300">{lang.name}</span>
            </div>
            <span className="text-gray-400">{lang.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
