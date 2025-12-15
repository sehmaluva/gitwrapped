'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import IntroSlide from './IntroSlide';
import ContributionsSlide from './ContributionsSlide';
import LanguagesSlide from './LanguagesSlide';
import TopReposSlide from './TopReposSlide';
import StreakSlide from './StreakSlide';
import RankingsSlide from './RankingsSlide';
import ProgressionSlide from './ProgressionSlide';
import SuggestionsSlide from './SuggestionsSlide';
import OutroSlide from './OutroSlide';

interface StoryModeProps {
  stats: {
    username: string;
    avatarUrl: string;
    totalContributions: number;
    commits: number;
    pullRequests: number;
    issues: number;
    reviews: number;
    languages: Array<{ name: string; percentage: number; color: string }>;
    topRepos: Array<{
      name: string;
      commits: number;
      additions: number;
      deletions: number;
    }>;
    longestStreak: number;
    currentStreak: number;
    contributionCalendar: {
      weeks: Array<{
        contributionDays: Array<{
          contributionCount: number;
          date: string;
        }>;
      }>;
    };
    followers: number;
    publicRepos: number;
  };
  onClose: () => void;
}

const SLIDE_DURATION = 8000; // 8 seconds per slide (slower)

// Background music URL (royalty-free upbeat music)
const MUSIC_URL = 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3';

export default function StoryMode({ stats, onClose }: StoryModeProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio(MUSIC_URL);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Handle music play/pause
  useEffect(() => {
    if (audioRef.current) {
      if (isMuted || isPaused) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {
          // Autoplay blocked, user needs to interact first
        });
      }
    }
  }, [isMuted, isPaused]);

  const toggleSound = () => {
    setIsMuted(!isMuted);
    if (audioRef.current && isMuted) {
      audioRef.current.play().catch(() => {});
    }
  };

  // Calculate most active day and month
  const getMostActiveDay = () => {
    const dayCounts: Record<string, number> = {
      Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0
    };
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    stats.contributionCalendar.weeks.forEach(week => {
      week.contributionDays.forEach(day => {
        const date = new Date(day.date);
        const dayName = dayNames[date.getDay()];
        dayCounts[dayName] += day.contributionCount;
      });
    });

    return Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0][0];
  };

  const getMostActiveMonth = () => {
    const monthCounts: Record<string, number> = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    stats.contributionCalendar.weeks.forEach(week => {
      week.contributionDays.forEach(day => {
        const date = new Date(day.date);
        const monthName = monthNames[date.getMonth()];
        monthCounts[monthName] = (monthCounts[monthName] || 0) + day.contributionCount;
      });
    });

    return Object.entries(monthCounts).sort((a, b) => b[1] - a[1])[0][0];
  };

  const slides = [
    {
      id: 'intro',
      component: (
        <IntroSlide
          username={stats.username}
          avatarUrl={stats.avatarUrl}
          year={new Date().getFullYear()}
        />
      ),
    },
    {
      id: 'contributions',
      component: (
        <ContributionsSlide
          totalContributions={stats.totalContributions}
          commits={stats.commits}
          pullRequests={stats.pullRequests}
          issues={stats.issues}
          reviews={stats.reviews}
          longestStreak={stats.longestStreak}
        />
      ),
    },
    {
      id: 'languages',
      component: <LanguagesSlide languages={stats.languages} />,
    },
    {
      id: 'repos',
      component: <TopReposSlide repos={stats.topRepos} />,
    },
    {
      id: 'streak',
      component: (
        <StreakSlide
          longestStreak={stats.longestStreak}
          currentStreak={stats.currentStreak}
          mostActiveDay={getMostActiveDay()}
          mostActiveMonth={getMostActiveMonth()}
        />
      ),
    },
    {
      id: 'rankings',
      component: (
        <RankingsSlide
          username={stats.username}
          avatarUrl={stats.avatarUrl}
          totalContributions={stats.totalContributions}
          followers={stats.followers}
          publicRepos={stats.publicRepos}
        />
      ),
    },
    {
      id: 'progression',
      component: (
        <ProgressionSlide
          contributionCalendar={stats.contributionCalendar}
        />
      ),
    },
    {
      id: 'suggestions',
      component: (
        <SuggestionsSlide
          stats={{
            totalContributions: stats.totalContributions,
            longestStreak: stats.longestStreak,
            currentStreak: stats.currentStreak,
            topLanguages: stats.languages,
            totalPRs: stats.pullRequests,
            totalReviews: stats.reviews,
          }}
        />
      ),
    },
    {
      id: 'outro',
      component: (
        <OutroSlide
          username={stats.username}
          avatarUrl={stats.avatarUrl}
          totalContributions={stats.totalContributions}
          year={new Date().getFullYear()}
          topLanguage={stats.languages[0]?.name || 'Code'}
        />
      ),
    },
  ];

  // Auto-advance slides
  useEffect(() => {
    if (isPaused || isRecording || !isAutoPlay) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => {
        if (prev >= slides.length - 1) {
          return prev; // Stay on last slide
        }
        return prev + 1;
      });
    }, SLIDE_DURATION);

    return () => clearInterval(timer);
  }, [isPaused, isRecording, isAutoPlay, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  // Export as animated video using screen capture
  const shareAsVideo = useCallback(async () => {
    try {
      // Request screen capture of the story element
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: 'browser',
        },
        audio: false,
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm',
      });

      chunksRef.current = [];
      setIsRecording(true);
      setCurrentSlide(0);

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach(track => track.stop());
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `github-wrapped-${stats.username}-${new Date().getFullYear()}.webm`;
        a.click();
        URL.revokeObjectURL(url);
        setIsRecording(false);
      };

      mediaRecorder.start();

      // Auto-advance through all slides
      let slideIndex = 0;
      const advanceSlide = () => {
        setCurrentSlide(slideIndex);
        setRecordingProgress(((slideIndex + 1) / slides.length) * 100);
        slideIndex++;

        if (slideIndex < slides.length) {
          setTimeout(advanceSlide, SLIDE_DURATION);
        } else {
          setTimeout(() => {
            mediaRecorder.stop();
          }, SLIDE_DURATION);
        }
      };

      advanceSlide();
    } catch (error) {
      console.error('Screen capture error:', error);
      setIsRecording(false);
    }
  }, [stats.username, slides.length]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black"
    >
      {/* Story container */}
      <div
        ref={containerRef}
        className="relative w-full h-full max-w-lg mx-auto"
      >
        {/* Progress bars */}
        <div className="absolute top-4 left-4 right-4 z-20 flex gap-1">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className="flex-1 h-1.5 bg-white/30 rounded-full overflow-hidden cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                goToSlide(index);
              }}
            >
              <motion.div
                className="h-full bg-white rounded-full"
                initial={{ width: '0%' }}
                animate={{
                  width: index < currentSlide ? '100%' : index === currentSlide ? '100%' : '0%',
                }}
                transition={{
                  duration: index === currentSlide && !isPaused && isAutoPlay ? SLIDE_DURATION / 1000 : 0.3,
                  ease: 'linear',
                }}
              />
            </div>
          ))}
        </div>

        {/* Top controls */}
        <div className="absolute top-10 left-4 right-4 z-20 flex justify-between items-center">
          {/* Sound toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleSound();
            }}
            className="text-white/80 hover:text-white p-2 bg-black/30 rounded-full backdrop-blur-sm"
          >
            {isMuted ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            )}
          </button>

          {/* Auto-play toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsAutoPlay(!isAutoPlay);
            }}
            className={`text-white/80 hover:text-white p-2 rounded-full backdrop-blur-sm ${isAutoPlay ? 'bg-green-500/30' : 'bg-black/30'}`}
          >
            {isAutoPlay ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Close button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="text-white/80 hover:text-white p-2 bg-black/30 rounded-full backdrop-blur-sm"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Slide content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="w-full h-full"
          >
            {slides[currentSlide].component}
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons - always visible */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
          disabled={currentSlide === 0}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 disabled:opacity-30 disabled:cursor-not-allowed text-white p-3 rounded-full backdrop-blur-sm transition-all"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
          disabled={currentSlide === slides.length - 1}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 disabled:opacity-30 disabled:cursor-not-allowed text-white p-3 rounded-full backdrop-blur-sm transition-all"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Slide counter */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full">
          <span className="text-white text-sm font-medium">
            {currentSlide + 1} / {slides.length}
          </span>
        </div>

        {/* Bottom controls */}
        <div className="absolute bottom-6 left-4 right-4 z-20 flex justify-center gap-3">
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              shareAsVideo();
            }}
            disabled={isRecording}
            className="flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-4 py-2.5 rounded-full font-medium text-sm disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isRecording ? (
              <>
                <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                {Math.round(recordingProgress)}%
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Record
              </>
            )}
          </motion.button>
        </div>

        {/* Pause indicator */}
        <AnimatePresence>
          {isPaused && !isRecording && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
            >
              <div className="bg-black/50 rounded-full p-4">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
