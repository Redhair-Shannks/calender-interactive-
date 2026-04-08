import { format, isSameDay, isSameMonth } from "date-fns";
import { generateCalendarDays, getWeekdayHeaders, isInRange, hasNoteOnDate } from "@/lib/calendar-utils";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme-context";
import { useState, useEffect } from "react";
import { HOLIDAYS } from "@/lib/types";

interface CalendarGridProps {
  currentMonth: Date;
  startDate: Date | null;
  endDate: Date | null;
  onDateClick: (day: Date) => void;
}

// Create holiday lookup map
const createHolidayMap = (): Record<string, { emoji: string; name: string }> => {
  const map: Record<string, { emoji: string; name: string }> = {};
  HOLIDAYS.forEach(holiday => {
    const key = `${holiday.month}-${holiday.day}`;
    map[key] = { emoji: holiday.emoji, name: holiday.name };
  });
  return map;
};

export function CalendarGrid({ currentMonth, startDate, endDate, onDateClick }: CalendarGridProps) {
  const { isDark } = useTheme();
  const days = generateCalendarDays(currentMonth);
  const weekdays = getWeekdayHeaders();
  const holidayMap = createHolidayMap();
  const [noteDates, setNoteDates] = useState<Set<string>>(new Set());
  const [hoveredHoliday, setHoveredHoliday] = useState<string | null>(null);

  useEffect(() => {
    const dates = new Set<string>();
    const year = currentMonth.getFullYear();
    const monthIndex = currentMonth.getMonth();

    // Year-aware general notes
    const generalNote = localStorage.getItem(`calendar-general-notes-${year}-${monthIndex}`);
    if (generalNote?.trim()) {
      dates.add(`month-${year}-${monthIndex}`);
    }

    // Range notes (already year-safe)
    const rangeNotesStr = localStorage.getItem("calendar-range-notes");
    if (rangeNotesStr) {
      try {
        const rangeNotes = JSON.parse(rangeNotesStr);
        Object.entries(rangeNotes).forEach(([key, value]) => {
          if (typeof value === 'string' && value.trim()) {
            const parts = key.split('-to-');
            if (parts.length === 2) {
              const start = new Date(parts[0]);
              const end = new Date(parts[1]);
              for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                if (isSameMonth(d, currentMonth)) {
                  dates.add(format(d, 'yyyy-MM-dd'));
                }
              }
            }
          }
        });
      } catch (e) {}
    }

    setNoteDates(dates);
  }, [currentMonth]);

  return (
    <div className="p-4 sm:p-6 md:p-8">
      {/* Weekday headers */}
      <div className={`grid grid-cols-7 gap-1.5 sm:gap-2 md:gap-3 text-center text-[10px] sm:text-xs font-bold mb-4 sm:mb-6 uppercase tracking-widest ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        {weekdays.map((day) => (
          <motion.div 
            key={day} 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="py-2 sm:py-3"
          >
            {day}
          </motion.div>
        ))}
      </div>

      {/* Date grid */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2 md:gap-3">
        {days.map((day, index) => {
          const isCurrentMonthDay = isSameMonth(day, currentMonth);
          const isStart = startDate && isSameDay(day, startDate);
          const isEnd = endDate && isSameDay(day, endDate);
          const inRange = isInRange(day, startDate, endDate);
          const today = isSameDay(day, new Date());
          const dateKey = `${day.getMonth() + 1}-${day.getDate()}`;
          const holiday = holidayMap[dateKey];
          const dateStr = format(day, 'yyyy-MM-dd');
          const hasNote = noteDates.has(dateStr);

          return (
            <div
              key={day.toISOString()}
              className="relative group aspect-square"
            >
              <motion.button
                onClick={() => onDateClick(day)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: index * 0.01 }}
                whileHover={{ scale: isCurrentMonthDay ? 1.1 : 1, y: isCurrentMonthDay ? -4 : 0 }}
                whileTap={{ scale: 0.92 }}
                onMouseEnter={() => holiday && setHoveredHoliday(dateKey)}
                onMouseLeave={() => setHoveredHoliday(null)}
                className={cn(
                  "w-full h-full flex flex-col items-center justify-center rounded-lg sm:rounded-xl md:rounded-2xl text-[11px] sm:text-sm font-semibold transition-all duration-300 relative overflow-hidden",
                  !isCurrentMonthDay && (isDark ? "text-gray-600 cursor-default" : "text-gray-300 cursor-default"),
                  isCurrentMonthDay && "cursor-pointer",
                  today && !isStart && !isEnd && (isDark 
                    ? "ring-2 ring-amber-500 bg-gradient-to-br from-amber-900/40 to-amber-800/30 text-amber-300" 
                    : "ring-2 ring-amber-400 bg-gradient-to-br from-amber-50 to-amber-100 text-amber-900"),
                  isStart || isEnd
                    ? (isDark 
                        ? "bg-gradient-to-br from-blue-700 to-blue-800 text-white shadow-lg" 
                        : "bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg")
                    : inRange
                    ? (isDark
                        ? "bg-gradient-to-br from-blue-900/40 to-blue-800/30 text-blue-300"
                        : "bg-gradient-to-br from-blue-100 to-blue-50 text-blue-700")
                    : isCurrentMonthDay && (isDark 
                        ? "hover:bg-gray-700/50 text-gray-300" 
                        : "hover:bg-gray-50 text-gray-700"),
                )}
                title={holiday ? `${holiday.emoji} ${holiday.name}` : undefined}
              >
                <span className="text-lg sm:text-xl md:text-2xl font-bold">
                  {format(day, "d")}
                </span>
                
                {holiday && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-base sm:text-lg md:text-xl mt-1"
                  >
                    {holiday.emoji}
                  </motion.span>
                )}
                
                {hasNote && !holiday && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full mt-0.5 ${
                      isStart || isEnd
                        ? 'bg-white/80'
                        : isDark 
                          ? 'bg-amber-400'
                          : 'bg-amber-500'
                    }`}
                  />
                )}
              </motion.button>

              {holiday && hoveredHoliday === dateKey && isCurrentMonthDay && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 10 }}
                  transition={{ duration: 0.15 }}
                  className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap z-50 shadow-lg ${
                    isDark
                      ? 'bg-gradient-to-r from-gray-700 to-gray-800 text-white border border-gray-600'
                      : 'bg-gradient-to-r from-amber-700 to-orange-700 text-white border border-amber-600'
                  }`}
                >
                  {holiday.emoji} {holiday.name}
                  <div className={`absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent ${
                    isDark 
                      ? 'border-t-gray-700'
                      : 'border-t-amber-700'
                  }`} />
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}