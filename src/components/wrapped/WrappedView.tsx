"use client";

import { useRef } from "react";
import Image from "next/image";
import { ProcessedStats } from "@/lib/github";
import { StatsCard } from "./StatsCard";
import { LanguageChart } from "./LanguageChart";
import { ContributionCalendar } from "./ContributionCalendar";
import { TopRepos } from "./TopRepos";

interface WrappedViewProps {
  stats: ProcessedStats;
}

export function WrappedView({ stats }: WrappedViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleShare = async () => {
    try {
      const { domToPng } = await import("modern-screenshot");
      if (containerRef.current) {
        const dataUrl = await domToPng(containerRef.current, {
          scale: 2,
          backgroundColor: "#030712",
          style: {
            // Ensure consistent rendering
            transform: "scale(1)",
          },
        });
        const link = document.createElement("a");
        link.download = `github-wrapped-${stats.username}-2025.png`;
        link.href = dataUrl;
        link.click();
      }
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      {/* Header */}
      <div className="text-center pt-6 sm:pt-8 md:pt-12 pb-4 sm:pb-6 md:pb-8 px-4">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold bg-gradient-to-r from-sky-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent mb-3 sm:mb-4">
          GitHub Wrapped 2025
        </h1>
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <Image
            src={stats.avatarUrl}
            alt={stats.name}
            width={64}
            height={64}
            className="rounded-full ring-4 ring-sky-500/30 w-12 h-12 sm:w-16 sm:h-16"
          />
          <div className="text-left">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">{stats.name}</h2>
            <p className="text-gray-400 text-sm sm:text-base">@{stats.username}</p>
          </div>
        </div>
        <button
          onClick={handleShare}
          className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-sky-500 to-emerald-600 hover:from-sky-600 hover:to-emerald-700 text-white rounded-full font-semibold flex items-center gap-2 mx-auto transition-all hover:scale-105 text-sm sm:text-base"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Download as Image
        </button>
      </div>

      {/* Stats Content */}
      <div ref={containerRef} className="max-w-6xl mx-auto px-3 sm:px-4 pb-8 sm:pb-12 space-y-4 sm:space-y-6 md:space-y-8" style={{ backgroundColor: "#030712" }}>
        {/* Hero Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          <StatsCard
            title="Total Contributions"
            value={stats.totalContributions}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            }
            gradient="from-green-500 to-emerald-600"
          />
          <StatsCard
            title="Commits"
            value={stats.totalCommits}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            gradient="from-blue-500 to-cyan-600"
          />
          <StatsCard
            title="Pull Requests"
            value={stats.totalPRs}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            }
            gradient="from-teal-500 to-emerald-600"
          />
          <StatsCard
            title="Code Reviews"
            value={stats.totalReviews}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            }
            gradient="from-cyan-500 to-sky-600"
          />
        </div>

        {/* Streak & Activity Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          <StatsCard
            title="Current Streak"
            value={`${stats.streakStats.currentStreak} days`}
            icon={<span className="text-lg sm:text-2xl">🔥</span>}
            gradient="from-orange-500 to-yellow-500"
          />
          <StatsCard
            title="Longest Streak"
            value={`${stats.streakStats.longestStreak} days`}
            icon={<span className="text-lg sm:text-2xl">🏆</span>}
            gradient="from-yellow-500 to-amber-600"
          />
          <StatsCard
            title="Most Productive Day"
            value={stats.mostProductiveDay}
            icon={<span className="text-lg sm:text-2xl">📅</span>}
            gradient="from-sky-500 to-cyan-600"
          />
          <StatsCard
            title="Most Productive Month"
            value={stats.mostProductiveMonth}
            icon={<span className="text-lg sm:text-2xl">📊</span>}
            gradient="from-emerald-500 to-teal-600"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          <LanguageChart languages={stats.topLanguages} />
          <TopRepos repositories={stats.topRepositories} />
        </div>

        {/* Contribution Calendar */}
        <ContributionCalendar data={stats.contributionCalendar} />

        {/* Footer */}
        <div className="text-center pt-8">
          <p className="text-gray-500 text-sm">
            Generated with ❤️ by GitHub Wrapped • {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}
