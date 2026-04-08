import { format, isSameDay, isSameMonth, isToday } from "date-fns";
import { generateCalendarDays, isInRange } from "@/lib/calendar-utils";
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

// Weekday headers exactly as in reference image: S M T W Th F S
const WEEKDAY_HEADERS = ["S", "M", "T", "W", "Th", "F", "S"];

export function CalendarGrid({
  currentMonth,
  startDate,
  endDate,
  onDateClick,
  selectionStep,
}: CalendarGridProps) {
  const { isDark } = useTheme();
  const days = useMemo(() => generateCalendarDays(currentMonth), [currentMonth]);

  const [noteDates, setNoteDates] = useState<Set<string>>(new Set());
  const [hoveredHoliday, setHoveredHoliday] = useState<string | null>(null);

  useEffect(() => {
    const dates = new Set<string>();
    const year = currentMonth.getFullYear();
    const monthIdx = currentMonth.getMonth();

    const generalNote = localStorage.getItem(`calendar-general-notes-${year}-${monthIdx}`);
    if (generalNote?.trim()) {
      dates.add(`month-${year}-${monthIdx}`);
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
    <div className="px-4 sm:px-6 pt-1 pb-3">
      {/* Weekday headers — matching reference: S M T W Th F S */}
      <div className="grid grid-cols-7 gap-1 text-center mb-1">
        {WEEKDAY_HEADERS.map((day, i) => (
          <div
            key={i}
            className="py-1 text-xs sm:text-sm font-bold text-white drop-shadow-sm select-none"
            style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Date grid */}
      <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
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
          const isAwaitingEnd = isStart && selectionStep === 1;

          return (
            <div key={day.toISOString()} className="relative group aspect-square">
              <motion.button
                onClick={() => isCurrentMonthDay && onDateClick(day)}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.16, delay: Math.min(index * 0.006, 0.22) }}
                whileHover={
                  isCurrentMonthDay
                    ? { scale: 1.12, transition: { duration: 0.13 } }
                    : {}
                }
                whileTap={isCurrentMonthDay ? { scale: 0.9 } : {}}
                onMouseEnter={() => holiday && setHoveredHoliday(dateKey)}
                onMouseLeave={() => setHoveredHoliday(null)}
                aria-label={`${format(day, "MMMM d, yyyy")}${holiday ? ` – ${holiday.name}` : ""}${isSelected ? " (selected)" : ""}`}
                aria-pressed={isSelected}
                className={cn(
                  "w-full h-full min-h-[34px] sm:min-h-[40px] flex flex-col items-center justify-center",
                  "rounded-lg text-[12px] sm:text-[15px] md:text-base font-bold",
                  "transition-all duration-150 relative overflow-hidden select-none",
                  // Not current month — very faded
                  !isCurrentMonthDay && "text-white/25 cursor-default",
                  // Current month base — white text on image
                  isCurrentMonthDay && !isSelected && !inRange && !todayDate && [
                    "text-white drop-shadow-md hover:bg-white/20 hover:backdrop-blur-sm",
                  ],
                  // Today highlight
                  todayDate && !isSelected && [
                    "ring-2 ring-white/90 bg-white/20 backdrop-blur-sm text-white",
                  ],
                  // Selected start/end
                  isSelected && [
                    "bg-white text-gray-900 shadow-lg",
                  ],
                  // In-range
                  inRange && [
                    "bg-white/30 backdrop-blur-sm text-white rounded-none",
                  ],
                  // Range edge rounding
                  isStart && endDate && !isSameDay(startDate!, endDate) && "rounded-l-lg rounded-r-none",
                  isEnd && startDate && !isSameDay(startDate!, endDate) && "rounded-r-lg rounded-l-none",
                )}
              >
                {/* Pulse ring when awaiting end selection */}
                {isAwaitingEnd && (
                  <motion.span
                    className="absolute inset-0 rounded-lg pointer-events-none ring-2 ring-white"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.4, repeat: Infinity }}
                  />
                )}

                <span
                  className="leading-none"
                  style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
                >
                  {format(day, "d")}
                </span>

                {holiday && isCurrentMonthDay && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.08 }}
                    className="text-[9px] sm:text-[11px] leading-none mt-0.5"
                    role="img"
                    aria-label={holiday.name}
                  >
                    {holiday.emoji}
                  </motion.span>
                )}

                {hasNote && !holiday && isCurrentMonthDay && (
                  <span
                    className={cn(
                      "w-1 h-1 rounded-full mt-0.5",
                      isSelected ? "bg-blue-500" : "bg-amber-300"
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
                  transition={{ duration: 0.12 }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold whitespace-nowrap z-50 pointer-events-none bg-gray-900/95 text-white shadow-xl"
                >
                  {holiday.emoji} {holiday.name}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900/95" />
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}