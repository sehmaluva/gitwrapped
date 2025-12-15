"use client";

import { useState } from "react";

interface CommitsTopRankingProps {
  username: string;
  location: string | null;
}

// Helper to format location for Commits.top URL
function getCountrySlug(location: string | null): { slug: string; name: string } | null {
  if (!location) return null;
  
  // Get the last part of the location (usually the country)
  const parts = location.split(',');
  const country = parts[parts.length - 1].trim();
  
  // Format for URL: lowercase and hyphenated
  const slug = country.toLowerCase().replace(/\s+/g, '-');
  
  return { slug, name: country };
}

export function CommitsTopRanking({ username, location }: CommitsTopRankingProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const countryInfo = getCountrySlug(location);
  
  // Commits.top uses country names in lowercase with hyphens for URLs
  // e.g. https://commits.top/united-states.html
  const commitsTopUrl = countryInfo 
    ? `https://commits.top/${countryInfo.slug}.html`
    : null;
  
  // If no country is detected, we don't show this card as Commits.top is country-based
  if (!countryInfo || !commitsTopUrl) return null;

  return (
    <a
      href={commitsTopUrl}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`block bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl p-6 border border-gray-700/50 transition-all duration-300 ${
        isHovered ? "border-emerald-500/50 shadow-lg shadow-emerald-500/20 scale-[1.02]" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Commits.top Ranking</h3>
            <p className="text-sm text-gray-400">{countryInfo.name} Ranking</p>
          </div>
        </div>
        <div className={`text-gray-400 transition-transform duration-300 ${isHovered ? "translate-x-1" : ""}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </div>
      </div>
      
      <p className="text-gray-300 text-sm mb-4">
        Check the most active GitHub users in {countryInfo.name} on Commits.top
      </p>
      
      <div className="flex items-center gap-2 text-emerald-400 font-medium text-sm">
        <span>View leaderboard</span>
        <svg className={`w-4 h-4 transition-transform duration-300 ${isHovered ? "translate-x-1" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>
    </a>
  );
}
