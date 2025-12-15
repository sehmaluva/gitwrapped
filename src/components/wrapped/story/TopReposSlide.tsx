'use client';

import { motion } from 'framer-motion';

interface TopReposSlideProps {
  repos: Array<{
    name: string;
    commits: number;
    additions: number;
    deletions: number;
  }>;
}

export default function TopReposSlide({ repos }: TopReposSlideProps) {
  const topRepos = repos.slice(0, 5);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-green-900 to-sky-900 overflow-hidden">
      {/* Animated lines background */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-sky-400 to-transparent w-full"
            style={{ top: `${i * 10 + 5}%` }}
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'linear',
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
        <motion.p
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-white/70 mb-6"
        >
          Your most active repositories
        </motion.p>

        {/* Repo cards */}
        <div className="w-full max-w-lg space-y-4">
          {topRepos.map((repo, index) => (
            <motion.div
              key={repo.name}
              initial={{ 
                opacity: 0, 
                y: 50,
                scale: 0.8 
              }}
              animate={{ 
                opacity: 1, 
                y: 0,
                scale: 1 
              }}
              transition={{ 
                delay: 0.4 + index * 0.2,
                type: 'spring',
                stiffness: 200
              }}
              className="relative"
            >
              <motion.div
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-5 border border-white/10"
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                {/* Rank badge */}
                <motion.div
                  className="absolute -left-3 -top-3 w-8 h-8 bg-gradient-to-br from-sky-400 to-cyan-500 rounded-full flex items-center justify-center shadow-lg"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.6 + index * 0.2, type: 'spring' }}
                >
                  <span className="text-white font-bold text-sm">#{index + 1}</span>
                </motion.div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="text-2xl"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                    >
                      📁
                    </motion.div>
                    <div>
                      <h3 className="text-white font-semibold text-lg truncate max-w-[200px]">
                        {repo.name}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-white/60">
                        <span className="flex items-center gap-1">
                          <span className="text-emerald-400">+{repo.additions.toLocaleString()}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="text-red-400">-{repo.deletions.toLocaleString()}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <motion.span
                      className="text-2xl md:text-3xl font-bold text-sky-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 + index * 0.2 }}
                    >
                      {repo.commits}
                    </motion.span>
                    <p className="text-xs text-white/50">commits</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Decorative elements */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <motion.div
          className="text-white/20 text-sm font-mono"
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          git commit -m &quot;Another productive year! 🚀&quot;
        </motion.div>
      </motion.div>
    </div>
  );
}
