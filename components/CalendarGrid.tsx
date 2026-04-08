import { format, isSameDay, isSameMonth, isToday } from "date-fns";
import { generateCalendarDays, getWeekdayHeaders, isInRange } from "@/lib/calendar-utils";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme-context";
import { useState, useEffect, useMemo } from "react";
import { HOLIDAYS } from "@/lib/types";

interface CalendarGridProps {
  currentMonth: Date;
  startDate: Date | null;
  endDate: Date | null;
  onDateClick: (day: Date) => void;
  selectionStep: 0 | 1 | 2;
}

const holidayMap: Record<string, { emoji: string; name: string }> = {};
HOLIDAYS.forEach((h) => {
  holidayMap[`${h.month}-${h.day}`] = { emoji: h.emoji, name: h.name };
});

export function CalendarGrid({
  currentMonth,
  startDate,
  endDate,
  onDateClick,
  selectionStep,
}: CalendarGridProps) {
  const { isDark } = useTheme();

  // Memoize day generation so it doesn't recompute on every render
  const days = useMemo(() => generateCalendarDays(currentMonth), [currentMonth]);
  const weekdays = useMemo(() => getWeekdayHeaders(), []);

  const [noteDates, setNoteDates] = useState<Set<string>>(new Set());
  const [hoveredHoliday, setHoveredHoliday] = useState<string | null>(null);

  useEffect(() => {
    const dates = new Set<string>();
    const year = currentMonth.getFullYear();
    const monthIndex = currentMonth.getMonth();

    const generalNote = localStorage.getItem(`calendar-general-notes-${year}-${monthIndex}`);
    if (generalNote?.trim()) {
      dates.add(`month-${year}-${monthIndex}`);
    }

    const rangeNotesStr = localStorage.getItem("calendar-range-notes");
    if (rangeNotesStr) {
      try {
        const rangeNotes = JSON.parse(rangeNotesStr);
        Object.entries(rangeNotes).forEach(([key, value]) => {
          if (typeof value === "string" && value.trim()) {
            const parts = key.split("-to-");
            if (parts.length === 2) {
              const start = new Date(parts[0]);
              const end = new Date(parts[1]);
              for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                if (isSameMonth(d, currentMonth)) {
                  dates.add(format(d, "yyyy-MM-dd"));
                }
              }
            }
          }
        });
      } catch {}
    }

    setNoteDates(dates);
  }, [currentMonth]);

  return (
    <div className="p-4 sm:p-6 md:p-8">
      {/* Weekday headers */}
      <div
        className={`grid grid-cols-7 gap-1 sm:gap-2 text-center text-[9px] sm:text-[11px] font-bold mb-3 sm:mb-5 uppercase tracking-[0.1em] ${
          isDark ? "text-gray-500" : "text-gray-400"
        }`}
      >
        {weekdays.map((day, i) => (
          <div key={day} className="py-1 sm:py-2">
            {/* Show full name on larger screens, abbreviation on tiny */}
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{day[0]}</span>
          </div>
        ))}
      </div>

      {/* Date grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-1.5 md:gap-2">
        {days.map((day, index) => {
          const isCurrentMonthDay = isSameMonth(day, currentMonth);
          const isStart = !!startDate && isSameDay(day, startDate);
          const isEnd = !!endDate && isSameDay(day, endDate);
          const inRange = isInRange(day, startDate, endDate) && !isStart && !isEnd;
          const todayDate = isToday(day);
          const dateKey = `${day.getMonth() + 1}-${day.getDate()}`;
          const holiday = holidayMap[dateKey];
          const dateStr = format(day, "yyyy-MM-dd");
          const hasNote = noteDates.has(dateStr);
          const isSelected = isStart || isEnd;

          // Pulse the start dot while waiting for end selection
          const isAwaitingEnd = isStart && selectionStep === 1;

          return (
            <div key={day.toISOString()} className="relative group aspect-square">
              <motion.button
                onClick={() => isCurrentMonthDay && onDateClick(day)}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.18, delay: Math.min(index * 0.008, 0.28) }}
                whileHover={
                  isCurrentMonthDay
                    ? { scale: 1.08, y: -2, transition: { duration: 0.15 } }
                    : {}
                }
                whileTap={isCurrentMonthDay ? { scale: 0.93 } : {}}
                onMouseEnter={() => holiday && setHoveredHoliday(dateKey)}
                onMouseLeave={() => setHoveredHoliday(null)}
                aria-label={`${format(day, "MMMM d, yyyy")}${holiday ? ` – ${holiday.name}` : ""}${isSelected ? " (selected)" : ""}`}
                aria-pressed={isSelected}
                className={cn(
                  // Base — min 44px touch target
                  "w-full h-full min-h-[36px] sm:min-h-[44px] flex flex-col items-center justify-center",
                  "rounded-lg sm:rounded-xl text-[11px] sm:text-sm font-bold",
                  "transition-colors duration-200 relative overflow-hidden select-none",
                  // Not current month
                  !isCurrentMonthDay && [
                    isDark ? "text-gray-700 cursor-default" : "text-gray-300 cursor-default",
                  ],
                  // Current month base
                  isCurrentMonthDay && !isSelected && !inRange && !todayDate && [
                    isDark
                      ? "text-gray-300 hover:bg-gray-700/70 hover:text-white"
                      : "text-gray-700 hover:bg-gray-100",
                  ],
                  // Today (not selected)
                  todayDate && !isSelected && [
                    isDark
                      ? "ring-2 ring-amber-500 bg-amber-900/30 text-amber-300"
                      : "ring-2 ring-amber-400 bg-amber-50 text-amber-800",
                  ],
                  // Start / End — solid blue
                  isSelected && [
                    isDark
                      ? "bg-blue-600 text-white shadow-md shadow-blue-900/40"
                      : "bg-blue-600 text-white shadow-md shadow-blue-200",
                  ],
                  // In-range — soft blue tint
                  inRange && [
                    isDark
                      ? "bg-blue-900/50 text-blue-300 rounded-none"
                      : "bg-blue-100 text-blue-700 rounded-none",
                  ],
                  // Range edge rounding: start gets rounded left, end gets rounded right
                  isStart && endDate && !isSameDay(startDate!, endDate) && "rounded-l-xl rounded-r-none",
                  isEnd && startDate && !isSameDay(startDate!, endDate) && "rounded-r-xl rounded-l-none",
                )}
              >
                {/* Pulse ring when awaiting second date click */}
                {isAwaitingEnd && (
                  <motion.span
                    className={`absolute inset-0 rounded-xl pointer-events-none ${
                      isDark ? "ring-2 ring-blue-400" : "ring-2 ring-blue-500"
                    }`}
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.4, repeat: Infinity }}
                  />
                )}

                <span className="text-[13px] sm:text-base md:text-lg font-bold leading-none">
                  {format(day, "d")}
                </span>

                {holiday && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-[11px] sm:text-sm leading-none mt-0.5"
                    role="img"
                    aria-label={holiday.name}
                  >
                    {holiday.emoji}
                  </motion.span>
                )}

                {/* Note dot — only show when no holiday (space constraint) */}
                {hasNote && !holiday && isCurrentMonthDay && (
                  <span
                    className={cn(
                      "w-1 h-1 rounded-full mt-0.5",
                      isSelected ? "bg-white/80" : isDark ? "bg-amber-400" : "bg-amber-500"
                    )}
                  />
                )}
              </motion.button>

              {/* Holiday tooltip */}
              {holiday && hoveredHoliday === dateKey && isCurrentMonthDay && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.85, y: 8 }}
                  transition={{ duration: 0.13 }}
                  className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold whitespace-nowrap z-50 pointer-events-none ${
                    isDark
                      ? "bg-gray-700 text-white border border-gray-600 shadow-xl"
                      : "bg-gray-900 text-white shadow-xl"
                  }`}
                >
                  {holiday.emoji} {holiday.name}
                  <div
                    className={`absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent ${
                      isDark ? "border-t-gray-700" : "border-t-gray-900"
                    }`}
                  />
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}