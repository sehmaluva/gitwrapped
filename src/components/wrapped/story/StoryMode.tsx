'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import IntroSlide from './IntroSlide';
import ContributionsSlide from './ContributionsSlide';
import LanguagesSlide from './LanguagesSlide';
import TopReposSlide from './TopReposSlide';
import StreakSlide from './StreakSlide';
import RankingsSlide from './RankingsSlide';
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

const SLIDE_DURATION = 5000; // 5 seconds per slide

export default function StoryMode({ stats, onClose }: StoryModeProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const chunksRef = useRef<Blob[]>([]);

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
    if (isPaused || isRecording) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => {
        if (prev >= slides.length - 1) {
          return prev; // Stay on last slide
        }
        return prev + 1;
      });
    }, SLIDE_DURATION);

    return () => clearInterval(timer);
  }, [isPaused, isRecording, slides.length]);

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
        className="relative w-full h-full max-w-md mx-auto"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          if (x < rect.width / 2) {
            prevSlide();
          } else {
            nextSlide();
          }
        }}
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Progress bars */}
        <div className="absolute top-4 left-4 right-4 z-20 flex gap-1">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden cursor-pointer"
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
                  duration: index === currentSlide && !isPaused ? SLIDE_DURATION / 1000 : 0.3,
                  ease: 'linear',
                }}
              />
            </div>
          ))}
        </div>

        {/* Close button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-10 right-4 z-20 text-white/80 hover:text-white p-2"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Slide content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            {slides[currentSlide].component}
          </motion.div>
        </AnimatePresence>

        {/* Navigation hints */}
        <div className="absolute inset-y-0 left-0 w-1/4 z-10" />
        <div className="absolute inset-y-0 right-0 w-1/4 z-10" />

        {/* Bottom controls */}
        <div className="absolute bottom-8 left-4 right-4 z-20 flex justify-center gap-4">
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              shareAsVideo();
            }}
            disabled={isRecording}
            className="flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-full font-medium disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isRecording ? (
              <>
                <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                Recording... {Math.round(recordingProgress)}%
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Record Video
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
