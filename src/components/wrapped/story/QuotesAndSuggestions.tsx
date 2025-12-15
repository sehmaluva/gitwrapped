'use client';

// Motivational quotes based on contribution levels
export function getMotivationalQuote(totalContributions: number, _streak?: number): string {
  if (totalContributions >= 2000) {
    return "🔥 You're a coding machine! Your dedication is truly inspiring.";
  } else if (totalContributions >= 1000) {
    return "🚀 Incredible year! You're in the top tier of developers.";
  } else if (totalContributions >= 500) {
    return "💪 Amazing progress! Your consistency is paying off.";
  } else if (totalContributions >= 200) {
    return "🌟 Great momentum! Keep pushing forward.";
  } else if (totalContributions >= 100) {
    return "🎯 Solid foundation! Every commit counts.";
  } else {
    return "🌱 Every journey starts with a single commit. Keep going!";
  }
}

export function getStreakQuote(longestStreak: number): string {
  if (longestStreak >= 100) {
    return "💯 A 100+ day streak?! You're unstoppable!";
  } else if (longestStreak >= 50) {
    return "🔥 50+ days of consistent coding. That's elite dedication!";
  } else if (longestStreak >= 30) {
    return "📈 A month-long streak shows real commitment!";
  } else if (longestStreak >= 14) {
    return "⚡ Two weeks strong! Momentum is building.";
  } else if (longestStreak >= 7) {
    return "🎯 A week of daily coding - great habit forming!";
  } else {
    return "🌟 Streaks start with day one. You've got this!";
  }
}

export function getLanguageQuote(topLanguage: string): string {
  const languageQuotes: Record<string, string> = {
    'TypeScript': "🎯 TypeScript master! Type safety is your superpower.",
    'JavaScript': "⚡ JavaScript wizard! Building the modern web.",
    'Python': "🐍 Python pro! From AI to automation, you do it all.",
    'Java': "☕ Java champion! Enterprise-grade excellence.",
    'C++': "🚀 C++ expert! Performance is your priority.",
    'C#': "🎮 C# specialist! From games to enterprise.",
    'Go': "🏃 Go enthusiast! Fast, simple, powerful.",
    'Rust': "🦀 Rust aficionado! Memory safety matters.",
    'Ruby': "💎 Ruby developer! Elegance in every line.",
    'PHP': "🐘 PHP professional! Powering the web.",
    'Swift': "🍎 Swift coder! Building beautiful iOS apps.",
    'Kotlin': "📱 Kotlin developer! Modern Android excellence.",
  };
  return languageQuotes[topLanguage] || `💻 ${topLanguage} developer! Master of your craft.`;
}

// Suggestions based on stats
export function getSuggestions(stats: {
  totalContributions: number;
  longestStreak: number;
  currentStreak: number;
  topLanguages: Array<{ name: string; percentage: number }>;
  totalPRs: number;
  totalReviews: number;
}): string[] {
  const suggestions: string[] = [];

  // Contribution suggestions
  if (stats.totalContributions < 365) {
    suggestions.push("🎯 Aim for daily contributions to build a green graph!");
  }

  // Streak suggestions
  if (stats.currentStreak === 0) {
    suggestions.push("🔥 Start a new streak today! Consistency is key.");
  } else if (stats.currentStreak < stats.longestStreak) {
    suggestions.push(`💪 ${stats.longestStreak - stats.currentStreak} more days to beat your record!`);
  }

  // Diversification suggestions
  if (stats.topLanguages.length > 0 && stats.topLanguages[0].percentage > 80) {
    suggestions.push("🌈 Try exploring a new language to diversify your skills!");
  }

  // Collaboration suggestions
  if (stats.totalPRs < 10) {
    suggestions.push("🤝 Consider contributing to open source projects!");
  }

  if (stats.totalReviews < 5) {
    suggestions.push("👀 Code reviews help you learn and help others grow!");
  }

  // Default encouraging suggestions
  if (suggestions.length === 0) {
    suggestions.push("🌟 You're doing amazing! Keep up the great work.");
    suggestions.push("📚 Share your knowledge - write a blog or tutorial!");
  }

  return suggestions.slice(0, 3);
}

// Fun facts based on contributions
export function getFunFact(totalContributions: number, totalCommits: number): string {
  const linesEstimate = totalCommits * 50; // Rough estimate
  const cupsOfCoffee = Math.floor(totalContributions / 10);
  
  const facts = [
    `☕ That's roughly ${cupsOfCoffee} cups of coffee worth of coding!`,
    `📝 You've probably written around ${linesEstimate.toLocaleString()}+ lines of code!`,
    `⌨️ At 100 keystrokes per commit, that's ${(totalCommits * 100).toLocaleString()} keystrokes!`,
    `🌍 If each contribution was 1km, you'd have traveled ${totalContributions}km!`,
  ];
  
  return facts[Math.floor(Math.random() * facts.length)];
}
