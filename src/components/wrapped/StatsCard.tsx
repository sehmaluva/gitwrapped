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
    <div className="relative overflow-hidden bg-gray-900/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-gray-800 group hover:border-gray-700 transition-all">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2 sm:mb-4">
          <span className="text-gray-400 text-xs sm:text-sm font-medium truncate pr-2">{title}</span>
          <div className="text-gray-500 flex-shrink-0">{icon}</div>
        </div>
        <div className="text-xl sm:text-2xl md:text-4xl font-bold text-white mb-1 truncate">
          {typeof value === "number" ? value.toLocaleString() : value}
        </div>
        {subtitle && <p className="text-gray-400 text-xs sm:text-sm truncate">{subtitle}</p>}
      </div>
    </div>
  );
}
