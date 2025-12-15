'use client';

import { motion } from 'framer-motion';
import { getLanguageQuote } from './QuotesAndSuggestions';

interface LanguagesSlideProps {
  languages: Array<{ name: string; percentage: number; color: string }>;
}

export default function LanguagesSlide({ languages }: LanguagesSlideProps) {
  const topLanguages = languages.slice(0, 5);
  const languageQuote = topLanguages[0] ? getLanguageQuote(topLanguages[0].name) : '';

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-sky-900 to-green-900 overflow-hidden">
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-1/4 -left-20 w-64 h-64 bg-sky-500/30 rounded-full blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-20 w-64 h-64 bg-green-500/30 rounded-full blur-3xl"
        animate={{
          x: [0, -50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col items-center w-full px-6"
      >
        {/* Header */}
        <motion.p
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-lg md:text-xl text-white/70 mb-2"
        >
          Your top languages
        </motion.p>

        {/* Top language showcase */}
        {topLanguages[0] && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8, type: 'spring', stiffness: 100 }}
            className="mb-10"
          >
            <motion.div
              className="text-5xl md:text-7xl font-black text-center"
              animate={{
                textShadow: [
                  `0 0 20px ${topLanguages[0].color}80`,
                  `0 0 40px ${topLanguages[0].color}60`,
                  `0 0 20px ${topLanguages[0].color}80`,
                ],
              }}
              transition={{ duration: 4, repeat: Infinity }}
              style={{ color: topLanguages[0].color }}
            >
              {topLanguages[0].name}
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5, duration: 0.6 }}
              className="text-center text-white/60 mt-2 text-lg"
            >
              was your #1 language
            </motion.p>
          </motion.div>
        )}

        {/* Language bars */}
        <div className="w-full max-w-md space-y-4">
          {topLanguages.map((lang, index) => (
            <motion.div
              key={lang.name}
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 3 + index * 0.4, duration: 0.6, type: 'spring' }}
              className="relative"
            >
              <div className="flex justify-between mb-1">
                <span className="text-white font-medium flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: lang.color }}
                  />
                  {lang.name}
                </span>
                <span className="text-white/70">{lang.percentage.toFixed(1)}%</span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: lang.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${lang.percentage}%` }}
                  transition={{ delay: 3.3 + index * 0.4, duration: 1, ease: 'easeOut' }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Language Quote */}
        {languageQuote && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 6, duration: 0.8 }}
            className="mt-6 text-white/60 text-sm italic text-center max-w-sm"
          >
            {languageQuote}
          </motion.p>
        )}
      </motion.div>

      {/* Floating language icons */}
      <div className="absolute inset-0 pointer-events-none">
        {['JS', 'TS', 'PY', 'RS', 'GO', 'C#'].map((lang, i) => (
          <motion.div
            key={lang}
            className="absolute text-white/5 text-4xl font-bold"
            style={{
              left: `${10 + (i * 15)}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          >
            {lang}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
