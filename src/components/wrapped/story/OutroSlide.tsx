'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface OutroSlideProps {
  username: string;
  avatarUrl: string;
  totalContributions: number;
  year: number;
  topLanguage: string;
}

const CELEBRATION_EMOJIS = ['🎉', '✨', '🌟', '🚀', '💻', '⭐'];

// Generate random particles once outside the component
function generateCelebrationParticles() {
  return CELEBRATION_EMOJIS.flatMap((emoji, i) => 
    [...Array(4)].map((_, j) => ({
      id: `${i}-${j}`,
      emoji,
      x: Math.random() * 100,
      duration: 4 + Math.random() * 3,
      delay: i * 0.3 + j * 1.5,
    }))
  );
}

export default function OutroSlide({
  username,
  avatarUrl,
  totalContributions,
  year,
  topLanguage,
}: OutroSlideProps) {
  // Use useState with initializer to generate values only once
  const [celebrationParticles] = useState(generateCelebrationParticles);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-sky-900 to-emerald-900 overflow-hidden">
      {/* Celebration particles */}
      <div className="absolute inset-0 overflow-hidden">
        {celebrationParticles.map((particle) => (
          <motion.span
            key={particle.id}
            className="absolute text-2xl md:text-3xl"
            initial={{
              x: `${particle.x}%`, 
              y: '110%',
              opacity: 0,
              rotate: 0
            }}
            animate={{ 
              y: '-10%',
              opacity: [0, 1, 0],
              rotate: 360
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: 'linear'
            }}
          >
            {particle.emoji}
          </motion.span>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10 flex flex-col items-center text-center px-6"
      >
        {/* Avatar with celebration ring */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="relative mb-6"
        >
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'conic-gradient(from 0deg, #38bdf8, #34d399, #a78bfa, #fb923c, #38bdf8)',
              padding: '4px',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          >
            <div className="w-full h-full bg-slate-900 rounded-full" />
          </motion.div>
          <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden m-1">
            <Image
              src={avatarUrl}
              alt={username}
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        {/* Main message */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-3xl md:text-5xl font-black text-white mb-4"
        >
          That&apos;s a wrap!
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-lg md:text-xl text-white/70 max-w-md"
        >
          @{username}, you had an amazing {year}!
        </motion.p>

        {/* Summary stats */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
            <span className="text-2xl font-bold text-emerald-400">{totalContributions.toLocaleString()}</span>
            <p className="text-xs text-white/60">contributions</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
            <span className="text-2xl font-bold text-sky-400">{topLanguage}</span>
            <p className="text-xs text-white/60">top language</p>
          </div>
        </motion.div>

        {/* Share CTA */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="mt-10"
        >
          <motion.div
            className="bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full px-8 py-3"
            animate={{
              boxShadow: [
                '0 0 20px rgba(56, 189, 248, 0.3)',
                '0 0 40px rgba(56, 189, 248, 0.5)',
                '0 0 20px rgba(56, 189, 248, 0.3)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <p className="text-white font-semibold">Share your #GitHubWrapped</p>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="mt-8 text-sm text-white/40"
        >
          See you in {year + 1}! 🚀
        </motion.p>
      </motion.div>

      {/* Decorative corner elements */}
      <motion.div
        className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-sky-500/20 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-emerald-500/20 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      />
    </div>
  );
}
