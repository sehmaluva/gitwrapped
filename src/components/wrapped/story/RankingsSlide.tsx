'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface RankingsSlideProps {
  username: string;
  avatarUrl: string;
  totalContributions: number;
  followers: number;
  publicRepos: number;
}

// Generate random stars once outside the component
function generateStars() {
  return [...Array(30)].map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    duration: 2 + Math.random() * 2,
    delay: Math.random() * 2,
  }));
}

export default function RankingsSlide({
  username,
  avatarUrl,
  totalContributions,
  followers,
  publicRepos,
}: RankingsSlideProps) {
  // Use useState with initializer to generate values only once
  const [stars] = useState(generateStars);

  // Simulated rankings based on contributions (you can replace with actual API calls)
  const rankings = [
    {
      platform: 'GitHub Global',
      icon: '🌍',
      rank: Math.max(1, Math.floor(10000000 / (totalContributions + 1))),
      topPercent: Math.min(99, Math.max(1, Math.floor(100 - (totalContributions / 50)))),
      color: 'from-sky-400 to-blue-500',
      available: true,
    },
    {
      platform: 'TopCommitters.io',
      icon: '🏆',
      rank: Math.max(1, Math.floor(500000 / (totalContributions + 1))),
      topPercent: Math.min(99, Math.max(1, Math.floor(100 - (totalContributions / 30)))),
      color: 'from-amber-400 to-orange-500',
      available: true,
    },
    {
      platform: 'Stardev.io',
      icon: '⭐',
      rank: Math.max(1, Math.floor(100000 / (publicRepos * 10 + 1))),
      topPercent: Math.min(99, Math.max(5, Math.floor(100 - publicRepos))),
      color: 'from-purple-400 to-pink-500',
      available: true,
    },
    {
      platform: 'Commits.top',
      icon: '📊',
      rank: Math.max(1, Math.floor(200000 / (totalContributions + 1))),
      topPercent: Math.min(99, Math.max(1, Math.floor(100 - (totalContributions / 40)))),
      color: 'from-emerald-400 to-teal-500',
      available: followers >= 50,
      requiredFollowers: 50,
    },
  ];

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 overflow-hidden">
      {/* Animated stars background */}
      <div className="absolute inset-0">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10 flex flex-col items-center w-full px-6"
      >
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/30">
            <Image
              src={avatarUrl}
              alt={username}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-white/60 text-sm">Your global rankings</p>
            <p className="text-white font-semibold">@{username}</p>
          </div>
        </motion.div>

        {/* Trophy animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
          className="text-6xl mb-6"
        >
          <motion.span
            animate={{
              filter: [
                'drop-shadow(0 0 10px rgba(251, 191, 36, 0.5))',
                'drop-shadow(0 0 30px rgba(251, 191, 36, 0.8))',
                'drop-shadow(0 0 10px rgba(251, 191, 36, 0.5))',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🏆
          </motion.span>
        </motion.div>

        {/* Rankings cards */}
        <div className="w-full max-w-md space-y-4">
          {rankings.map((ranking, index) => (
            <motion.div
              key={ranking.platform}
              initial={{ x: index % 2 === 0 ? -100 : 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 + index * 0.2, type: 'spring' }}
            >
              <div className={`relative bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 ${!ranking.available ? 'opacity-60' : ''}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.span
                      className="text-3xl"
                      animate={ranking.available ? { rotate: [0, 10, -10, 0] } : {}}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                    >
                      {ranking.icon}
                    </motion.span>
                    <div>
                      <h3 className="text-white font-semibold">{ranking.platform}</h3>
                      {!ranking.available && (
                        <p className="text-xs text-amber-400">
                          Requires {ranking.requiredFollowers}+ followers
                        </p>
                      )}
                    </div>
                  </div>
                  {ranking.available ? (
                    <div className="text-right">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.8 + index * 0.2, type: 'spring' }}
                      >
                        <span className={`text-2xl font-bold bg-gradient-to-r ${ranking.color} bg-clip-text text-transparent`}>
                          #{ranking.rank.toLocaleString()}
                        </span>
                      </motion.div>
                      <p className="text-xs text-white/50">Top {ranking.topPercent}%</p>
                    </div>
                  ) : (
                    <div className="text-right">
                      <span className="text-2xl">🔒</span>
                      <p className="text-xs text-white/50">Locked</p>
                    </div>
                  )}
                </div>

                {/* Progress bar for top percent */}
                {ranking.available && (
                  <div className="mt-3">
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${ranking.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${100 - ranking.topPercent}%` }}
                        transition={{ delay: 1 + index * 0.2, duration: 1, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-6 text-xs text-white/40 text-center"
        >
          * Rankings are estimated based on your contribution data
        </motion.p>
      </motion.div>

      {/* Floating rank badges */}
      {['🥇', '🥈', '🥉'].map((medal, i) => (
        <motion.div
          key={medal}
          className="absolute text-3xl opacity-20"
          style={{
            left: `${15 + i * 30}%`,
            bottom: '10%',
          }}
          animate={{
            y: [0, -15, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        >
          {medal}
        </motion.div>
      ))}
    </div>
  );
}
