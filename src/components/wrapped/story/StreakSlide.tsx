'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface StreakSlideProps {
  longestStreak: number;
  currentStreak: number;
  mostActiveDay: string;
  mostActiveMonth: string;
}

// Generate random particles once outside the component
function generateFireParticles() {
  return [...Array(15)].map((_, i) => ({
    id: i,
    x: 30 + Math.random() * 40,
    duration: 2 + Math.random() * 2,
    delay: Math.random() * 2,
  }));
}

export default function StreakSlide({
  longestStreak,
  currentStreak,
  mostActiveDay,
  mostActiveMonth,
}: StreakSlideProps) {
  // Use useState with initializer to generate values only once
  const [fireParticles] = useState(generateFireParticles);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-orange-900 to-red-900 overflow-hidden">
      {/* Animated fire particles */}
      <div className="absolute inset-0 overflow-hidden">
        {fireParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute"
            initial={{ 
              x: `${particle.x}%`,
              y: '100%',
              opacity: 0,
              scale: 0
            }}
            animate={{ 
              y: '0%',
              opacity: [0, 1, 0],
              scale: [0, 1, 0.5]
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: 'easeOut'
            }}
          >
            <span className="text-2xl md:text-3xl">🔥</span>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10 flex flex-col items-center px-6"
      >
        {/* Header */}
        <motion.p
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-white/70 mb-4"
        >
          You were on fire!
        </motion.p>

        {/* Longest streak highlight */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
          className="text-center"
        >
          <motion.div
            className="relative inline-block"
            animate={{
              filter: [
                'drop-shadow(0 0 20px rgba(251, 146, 60, 0.5))',
                'drop-shadow(0 0 40px rgba(251, 146, 60, 0.8))',
                'drop-shadow(0 0 20px rgba(251, 146, 60, 0.5))',
              ]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <span className="text-7xl md:text-9xl font-black bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 bg-clip-text text-transparent">
              {longestStreak}
            </span>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-xl md:text-2xl text-white/80 font-medium"
          >
            day streak
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-white/50"
          >
            Your longest this year
          </motion.p>
        </motion.div>

        {/* Additional stats */}
        <motion.div
          className="grid grid-cols-2 gap-6 mt-10 w-full max-w-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <motion.div
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-3xl md:text-4xl font-bold text-orange-400">
              {currentStreak}
            </span>
            <p className="text-sm text-white/60 mt-1">Current streak</p>
          </motion.div>

          <motion.div
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-xl md:text-2xl font-bold text-yellow-400">
              {mostActiveDay}
            </span>
            <p className="text-sm text-white/60 mt-1">Most active day</p>
          </motion.div>
        </motion.div>

        {/* Most active month */}
        <motion.div
          className="mt-6 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full px-6 py-3"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5 }}
        >
          <p className="text-white/80">
            <span className="text-orange-400 font-semibold">{mostActiveMonth}</span> was your most productive month
          </p>
        </motion.div>
      </motion.div>

      {/* Animated streak flames on sides */}
      <motion.div
        className="absolute left-4 top-1/2 -translate-y-1/2 text-6xl opacity-20"
        animate={{ y: [-10, 10, -10], rotate: [-5, 5, -5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        🔥
      </motion.div>
      <motion.div
        className="absolute right-4 top-1/2 -translate-y-1/2 text-6xl opacity-20"
        animate={{ y: [10, -10, 10], rotate: [5, -5, 5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        🔥
      </motion.div>
    </div>
  );
}
