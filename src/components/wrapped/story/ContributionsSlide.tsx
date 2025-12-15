'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { getMotivationalQuote } from './QuotesAndSuggestions';

interface ContributionsSlideProps {
  totalContributions: number;
  commits: number;
  pullRequests: number;
  issues: number;
  reviews: number;
  longestStreak?: number;
}

const CODE_SYMBOLS = ['{ }', '< />', '( )', '[ ]', '=> ', '++', '==', '&&'];

// Generate random particles once outside the component
function generateCodeParticles() {
  return CODE_SYMBOLS.map((symbol, i) => ({
    symbol,
    id: i,
    x: Math.random() * 100,
    duration: 8 + Math.random() * 4,
    delay: Math.random() * 3,
  }));
}

export default function ContributionsSlide({
  totalContributions,
  commits,
  pullRequests,
  issues,
  reviews,
  longestStreak = 0,
}: ContributionsSlideProps) {
  const quote = getMotivationalQuote(totalContributions, longestStreak);
  const stats = [
    { label: 'Commits', value: commits, color: 'from-emerald-400 to-green-500' },
    { label: 'Pull Requests', value: pullRequests, color: 'from-sky-400 to-blue-500' },
    { label: 'Issues', value: issues, color: 'from-violet-400 to-purple-500' },
    { label: 'Reviews', value: reviews, color: 'from-amber-400 to-orange-500' },
  ];

  // Use useState with initializer to generate values only once
  const [codeParticles] = useState(generateCodeParticles);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-green-900 to-sky-900 overflow-hidden">
      {/* Animated code particles */}
      <div className="absolute inset-0 overflow-hidden">
        {codeParticles.map((particle) => (
          <motion.span
            key={particle.id}
            className="absolute text-white/10 text-2xl font-mono"
            initial={{ 
              x: particle.x + '%', 
              y: '110%',
              rotate: 0 
            }}
            animate={{ 
              y: '-10%',
              rotate: 360
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: 'linear'
            }}
          >
            {particle.symbol}
          </motion.span>
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
          You made
        </motion.p>

        {/* Big number counter */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
          className="relative"
        >
          <motion.span 
            className="text-6xl md:text-8xl lg:text-9xl font-black text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Counter value={totalContributions} />
          </motion.span>
          
          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 blur-3xl bg-gradient-to-r from-emerald-500/50 to-sky-500/50 -z-10"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-2xl md:text-3xl text-white/90 mt-2 font-medium"
        >
          contributions
        </motion.p>

        {/* Stats breakdown */}
        <motion.div
          className="grid grid-cols-2 gap-4 mt-10 md:mt-16 w-full max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.4 + index * 0.15, type: 'spring' }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center"
            >
              <motion.span
                className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
              >
                <Counter value={stat.value} delay={1.6 + index * 0.15} />
              </motion.span>
              <p className="text-sm md:text-base text-white/70 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Motivational Quote */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-8 text-center"
        >
          <p className="text-white/80 text-sm md:text-base italic">{quote}</p>
        </motion.div>
      </motion.div>

      {/* Corner decorations */}
      <motion.div
        className="absolute top-10 left-10 w-20 h-20 border-l-2 border-t-2 border-emerald-500/30"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.8 }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-20 h-20 border-r-2 border-b-2 border-sky-500/30"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2 }}
      />
    </div>
  );
}

// Animated counter component
function Counter({ value, delay = 0 }: { value: number; delay?: number }) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {value.toLocaleString()}
      </motion.span>
    </motion.span>
  );
}
