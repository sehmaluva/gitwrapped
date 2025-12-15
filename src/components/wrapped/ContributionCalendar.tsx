"use client";

interface ContributionDay {
  date: string;
  count: number;
  weekday: number;
}

interface ContributionCalendarProps {
  data: ContributionDay[];
}

export function ContributionCalendar({ data }: ContributionCalendarProps) {
  const getColor = (count: number) => {
    if (count === 0) return "bg-gray-800";
    if (count < 3) return "bg-green-900";
    if (count < 6) return "bg-green-700";
    if (count < 10) return "bg-green-500";
    return "bg-green-400";
  };

  // Group by weeks
  const weeks: ContributionDay[][] = [];
  let currentWeek: ContributionDay[] = [];

  data.forEach((day, index) => {
    currentWeek.push(day);
    if (day.weekday === 6 || index === data.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
      <h3 className="text-xl font-bold text-white mb-4">Contribution Calendar</h3>
      <div className="overflow-x-auto">
        <div className="flex gap-1 min-w-fit">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day) => (
                <div
                  key={day.date}
                  className={`w-3 h-3 rounded-sm ${getColor(day.count)} transition-all hover:ring-2 hover:ring-white/30`}
                  title={`${day.date}: ${day.count} contributions`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 mt-4 text-sm text-gray-400">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-gray-800" />
          <div className="w-3 h-3 rounded-sm bg-green-900" />
          <div className="w-3 h-3 rounded-sm bg-green-700" />
          <div className="w-3 h-3 rounded-sm bg-green-500" />
          <div className="w-3 h-3 rounded-sm bg-green-400" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
