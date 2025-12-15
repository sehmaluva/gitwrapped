'use client';

import { motion } from 'framer-motion';

interface ProgressionSlideProps {
  contributionCalendar: {
    weeks: Array<{
      contributionDays: Array<{
        contributionCount: number;
        date: string;
      }>;
    }>;
  };
}

export default function ProgressionSlide({ contributionCalendar }: ProgressionSlideProps) {
  // Calculate monthly contributions
  const monthlyData = calculateMonthlyContributions(contributionCalendar);
  const maxContributions = Math.max(...monthlyData.map(m => m.count), 1);
  
  // Calculate cumulative contributions using reduce (not reassigning)
  const cumulativeData = monthlyData.reduce<Array<{ month: string; count: number; cumulative: number }>>(
    (acc, m) => {
      const prevCumulative = acc.length > 0 ? acc[acc.length - 1].cumulative : 0;
      acc.push({ month: m.month, count: m.count, cumulative: prevCumulative + m.count });
      return acc;
    },
    []
  );
  const totalCumulative = cumulativeData.length > 0 ? cumulativeData[cumulativeData.length - 1].cumulative : 0;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-sky-900 to-green-900 overflow-hidden px-6">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10 w-full max-w-lg"
      >
        {/* Header */}
        <motion.p
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-white/70 mb-2 text-center"
        >
          Your coding journey
        </motion.p>
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-2xl md:text-3xl font-bold text-white mb-8 text-center"
        >
          Month by Month
        </motion.h2>

        {/* Bar Chart */}
        <div className="space-y-3">
          {cumulativeData.map((data, index) => (
            <motion.div
              key={data.month}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="flex items-center gap-3"
            >
              <span className="text-sm text-white/60 w-10 text-right">{data.month}</span>
              <div className="flex-1 h-6 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-sky-500 to-green-500 rounded-full relative"
                  initial={{ width: 0 }}
                  animate={{ width: `${(data.count / maxContributions) * 100}%` }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.8, ease: 'easeOut' }}
                >
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 + index * 0.1 }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-white"
                  >
                    {data.count > 0 ? data.count : ''}
                  </motion.span>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Cumulative line indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-8 text-center"
        >
          <p className="text-white/60 text-sm">Total by year end</p>
          <motion.p
            className="text-4xl font-bold bg-gradient-to-r from-sky-400 to-green-400 bg-clip-text text-transparent"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 2.2, type: 'spring' }}
          >
            {totalCumulative.toLocaleString()}
          </motion.p>
          <p className="text-white/40 text-sm">contributions</p>
        </motion.div>
      </motion.div>

      {/* Trend line decoration */}
      <motion.div
        className="absolute bottom-20 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
      >
        <p className="text-white/30 text-sm">📈 Your growth story</p>
      </motion.div>
    </div>
  );
}

function calculateMonthlyContributions(calendar: {
  weeks: Array<{
    contributionDays: Array<{
      contributionCount: number;
      date: string;
    }>;
  }>;
}) {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthCounts: Record<string, number> = {};
  
  // Initialize all months
  monthNames.forEach(m => monthCounts[m] = 0);
  
  calendar.weeks.forEach(week => {
    week.contributionDays.forEach(day => {
      const date = new Date(day.date);
      const monthName = monthNames[date.getMonth()];
      monthCounts[monthName] += day.contributionCount;
    });
  });

  return monthNames.map(month => ({
    month,
    count: monthCounts[month] || 0,
  }));
}
