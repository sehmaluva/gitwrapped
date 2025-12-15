'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface IntroSlideProps {
  username: string;
  avatarUrl: string;
  year: number;
}

// Generate random particles once outside the component
function generateParticles() {
  return [...Array(20)].map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    duration: 4 + Math.random() * 3,
    delay: Math.random() * 2,
  }));
}

export default function IntroSlide({ username, avatarUrl, year }: IntroSlideProps) {
  // Use useState with initializer to generate values only once
  const [particles] = useState(generateParticles);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-sky-900 to-emerald-900 overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            initial={{ 
              x: particle.x + '%', 
              y: '110%',
              opacity: 0 
            }}
            animate={{ 
              y: '-10%',
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: 'linear'
            }}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 flex flex-col items-center"
      >
        {/* Avatar with glow */}
        <motion.div
          className="relative"
          animate={{
            boxShadow: [
              '0 0 20px rgba(56, 189, 248, 0.5)',
              '0 0 60px rgba(56, 189, 248, 0.8)',
              '0 0 20px rgba(56, 189, 248, 0.5)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white/30">
            <Image
              src={avatarUrl}
              alt={username}
              width={160}
              height={160}
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        {/* Username */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-6 text-3xl md:text-4xl font-bold text-white"
        >
          @{username}
        </motion.h1>

        {/* Year */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-4"
        >
          <span className="text-6xl md:text-8xl font-black bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">
            {year}
          </span>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="mt-4 text-lg md:text-xl text-white/70"
        >
          Your Year in Code
        </motion.p>
      </motion.div>

      {/* Animated rings */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        {[1, 2, 3].map((ring) => (
          <motion.div
            key={ring}
            className="absolute border border-white/10 rounded-full"
            style={{
              width: 200 + ring * 100,
              height: 200 + ring * 100,
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: ring * 0.5,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}
