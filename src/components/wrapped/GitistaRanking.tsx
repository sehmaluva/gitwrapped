"use client";

import { useState } from "react";

interface GitistaRankingProps {
  username: string;
  location: string | null;
}

// Map common location strings to country codes for Gitista
function getCountryCode(location: string | null): string | null {
  if (!location) return null;
  
  const locationLower = location.toLowerCase();
  
  // Common country mappings
  const countryMappings: Record<string, string> = {
    // Full names
    "united states": "us",
    "usa": "us",
    "united kingdom": "uk",
    "uk": "uk",
    "england": "uk",
    "germany": "de",
    "france": "fr",
    "canada": "ca",
    "australia": "au",
    "india": "in",
    "brazil": "br",
    "japan": "jp",
    "china": "cn",
    "south korea": "kr",
    "korea": "kr",
    "netherlands": "nl",
    "spain": "es",
    "italy": "it",
    "russia": "ru",
    "poland": "pl",
    "sweden": "se",
    "switzerland": "ch",
    "portugal": "pt",
    "indonesia": "id",
    "mexico": "mx",
    "turkey": "tr",
    "argentina": "ar",
    "south africa": "za",
    "nigeria": "ng",
    "kenya": "ke",
    "egypt": "eg",
    "israel": "il",
    "singapore": "sg",
    "vietnam": "vn",
    "thailand": "th",
    "philippines": "ph",
    "pakistan": "pk",
    "bangladesh": "bd",
    "ukraine": "ua",
    "czech republic": "cz",
    "czechia": "cz",
    "austria": "at",
    "belgium": "be",
    "denmark": "dk",
    "finland": "fi",
    "norway": "no",
    "ireland": "ie",
    "new zealand": "nz",
    "malaysia": "my",
    "taiwan": "tw",
    "hong kong": "hk",
    "colombia": "co",
    "chile": "cl",
    "peru": "pe",
    "romania": "ro",
    "greece": "gr",
    "hungary": "hu",
  };

  // Check for exact matches or contains
  for (const [key, code] of Object.entries(countryMappings)) {
    if (locationLower.includes(key)) {
      return code;
    }
  }

  // Check for 2-letter country codes in the location string
  const twoLetterMatch = locationLower.match(/\b([a-z]{2})\b/);
  if (twoLetterMatch) {
    const possibleCode = twoLetterMatch[1];
    // Validate it's a known code
    const knownCodes = Object.values(countryMappings);
    if (knownCodes.includes(possibleCode)) {
      return possibleCode;
    }
  }

  return null;
}

export function GitistaRanking({ username, location }: GitistaRankingProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const countryCode = getCountryCode(location);
  const gitistaUrl = countryCode 
    ? `https://gitista.com/${countryCode}/${username}`
    : `https://gitista.com/global/${username}`;
  
  const rankingType = countryCode ? `${countryCode.toUpperCase()} Ranking` : "Global Ranking";

  return (
    <a
      href={gitistaUrl}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`block bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl p-6 border border-gray-700/50 transition-all duration-300 ${
        isHovered ? "border-sky-500/50 shadow-lg shadow-sky-500/20 scale-[1.02]" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Gitista Ranking</h3>
            <p className="text-sm text-gray-400">{rankingType}</p>
          </div>
        </div>
        <div className={`text-gray-400 transition-transform duration-300 ${isHovered ? "translate-x-1" : ""}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </div>
      </div>
      
      <p className="text-gray-300 text-sm mb-4">
        See how you rank among {countryCode ? `developers in ${countryCode.toUpperCase()}` : "developers worldwide"} on Gitista
      </p>
      
      <div className="flex items-center gap-2 text-sky-400 font-medium text-sm">
        <span>View your ranking</span>
        <svg className={`w-4 h-4 transition-transform duration-300 ${isHovered ? "translate-x-1" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>
      
      {location && (
        <div className="mt-4 pt-4 border-t border-gray-700/50">
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {location}
          </p>
        </div>
      )}
    </a>
  );
}
