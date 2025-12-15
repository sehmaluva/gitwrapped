"use client";

import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  gradient?: string;
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon,
  gradient = "from-sky-500 to-emerald-600",
}: StatsCardProps) {
  return (
    <div className="relative overflow-hidden bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 group hover:border-gray-700 transition-all">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-400 text-sm font-medium">{title}</span>
          <div className="text-gray-500">{icon}</div>
        </div>
        <div className="text-4xl font-bold text-white mb-1">
          {typeof value === "number" ? value.toLocaleString() : value}
        </div>
        {subtitle && <p className="text-gray-400 text-sm">{subtitle}</p>}
      </div>
    </div>
  );
}
