"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ProcessedStats } from "@/lib/github";
import { StatsCard } from "./StatsCard";
import { LanguageChart } from "./LanguageChart";
import { ContributionCalendar } from "./ContributionCalendar";
import { TopRepos } from "./TopRepos";
import StoryMode from "./story/StoryMode";

interface WrappedViewProps {
  stats: ProcessedStats;
}

export function WrappedView({ stats }: WrappedViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showStoryMode, setShowStoryMode] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const generateImage = async () => {
    const { domToPng } = await import("modern-screenshot");
    if (containerRef.current) {
      return await domToPng(containerRef.current, {
        scale: 2,
        backgroundColor: "#030712",
        style: {
          transform: "scale(1)",
        },
      });
    }
    return null;
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const dataUrl = await generateImage();
      if (!dataUrl) {
        setIsSharing(false);
        return;
      }

      // Convert data URL to blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], `github-wrapped-${stats.username}-2025.png`, { type: 'image/png' });

      // Try native share with file first (works on most mobile browsers)
      if (typeof navigator !== 'undefined' && navigator.share) {
        try {
          // Check if we can share files
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({ files: [file] });
            setIsSharing(false);
            return;
          }
        } catch (e) {
          // canShare might throw, continue to fallback
          console.log("File sharing not supported, trying text share");
        }

        // Try sharing without file (text/url only)
        try {
          await navigator.share({
            title: `${stats.name}'s GitHub Wrapped 2025`,
            text: `Check out my GitHub Wrapped 2025! 🚀 ${stats.totalContributions} contributions this year!`,
          });
          // Also download since we couldn't share the image
          downloadImage(dataUrl);
          setIsSharing(false);
          return;
        } catch (e) {
          if ((e as Error).name === 'AbortError') {
            // User cancelled
            setIsSharing(false);
            return;
          }
        }
      }

      // Fallback: direct download
      downloadImage(dataUrl);
    } catch (error) {
      console.error("Error sharing:", error);
    } finally {
      setIsSharing(false);
    }
  };

  const downloadImage = (dataUrl: string) => {
    const link = document.createElement("a");
    link.download = `github-wrapped-${stats.username}-2025.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          {/* Share Button */}
          <button
            onClick={handleShare}
            disabled={isSharing}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-sky-500 to-emerald-600 hover:from-sky-600 hover:to-emerald-700 text-white rounded-full font-semibold flex items-center gap-2 transition-all hover:scale-105 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSharing ? (
              <>
                <svg className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Preparing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </>
            )}
          </button>
        </div>
        <button
          onClick={() => setShowStoryMode(true)}
          className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 hover:from-violet-600 hover:via-purple-600 hover:to-pink-600 text-white rounded-full font-bold flex items-center gap-3 mx-auto transition-all hover:scale-105 text-base sm:text-lg shadow-lg shadow-purple-500/30"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          Watch Animated Story
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
            @sehmaluva• {new Date().getFullYear()}
          </p>
        </div>
      </div>

      {/* Story Mode Overlay */}
      {showStoryMode && (
        <StoryMode
          stats={{
            username: stats.username,
            avatarUrl: stats.avatarUrl,
            totalContributions: stats.totalContributions,
            commits: stats.totalCommits,
            pullRequests: stats.totalPRs,
            issues: stats.totalIssues,
            reviews: stats.totalReviews,
            languages: stats.topLanguages.map(lang => ({
              name: lang.name,
              percentage: lang.percentage,
              color: lang.color,
            })),
            topRepos: stats.topRepositories.map(repo => ({
              name: repo.name,
              commits: repo.commits,
              additions: repo.additions,
              deletions: repo.deletions,
            })),
            longestStreak: stats.streakStats.longestStreak,
            currentStreak: stats.streakStats.currentStreak,
            contributionCalendar: {
              // Convert flat array back to weeks format for StoryMode
              weeks: stats.contributionCalendar.reduce((weeks, day, index) => {
                const weekIndex = Math.floor(index / 7);
                if (!weeks[weekIndex]) {
                  weeks[weekIndex] = { contributionDays: [] };
                }
                weeks[weekIndex].contributionDays.push({
                  contributionCount: day.count,
                  date: day.date,
                });
                return weeks;
              }, [] as Array<{ contributionDays: Array<{ contributionCount: number; date: string }> }>),
            },
            followers: stats.followers || 0,
            publicRepos: stats.publicRepos || 0,
          }}
          onClose={() => setShowStoryMode(false)}
        />
      )}
    </div>
  );
}
