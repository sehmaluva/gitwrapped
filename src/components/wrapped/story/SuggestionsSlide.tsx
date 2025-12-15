'use client';

import { motion } from 'framer-motion';
import { getSuggestions, getMotivationalQuote } from './QuotesAndSuggestions';

interface SuggestionsSlideProps {
  stats: {
    totalContributions: number;
    longestStreak: number;
    currentStreak: number;
    topLanguages: Array<{ name: string; percentage: number }>;
    totalPRs: number;
    totalReviews: number;
  };
}

export default function SuggestionsSlide({ stats }: SuggestionsSlideProps) {
  const suggestions = getSuggestions(stats);
  const quote = getMotivationalQuote(stats.totalContributions, stats.longestStreak);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-green-900 to-sky-900 overflow-hidden px-6">
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-1/4 -left-20 w-64 h-64 bg-green-500/20 rounded-full blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-20 w-64 h-64 bg-sky-500/20 rounded-full blur-3xl"
        animate={{
          x: [0, -50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10 flex flex-col items-center w-full max-w-md"
      >
        {/* Motivational Quote */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-8"
        >
          <motion.div
            className="text-4xl mb-4"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            💡
          </motion.div>
          <p className="text-xl md:text-2xl font-semibold text-white leading-relaxed">
            {quote}
          </p>
        </motion.div>

        {/* Suggestions Header */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-white/60 text-sm uppercase tracking-wider mb-4"
        >
          Tips for {new Date().getFullYear() + 1}
        </motion.p>

        {/* Suggestions */}
        <div className="space-y-4 w-full">
          {suggestions.map((suggestion, index) => (
            <motion.div
              key={index}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8 + index * 0.2, type: 'spring' }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10"
            >
              <p className="text-white/90 text-base">{suggestion}</p>
            </motion.div>
          ))}
        </div>

        {/* Bottom decoration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-8 text-center"
        >
          <p className="text-white/40 text-sm">Your next chapter starts now ✨</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
