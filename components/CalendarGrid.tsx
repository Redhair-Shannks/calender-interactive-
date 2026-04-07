import { format, isSameDay, isSameMonth } from "date-fns";
import { generateCalendarDays, getWeekdayHeaders, isInRange } from "@/lib/calendar-utils";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CalendarGridProps {
  currentMonth: Date;
  startDate: Date | null;
  endDate: Date | null;
  onDateClick: (day: Date) => void;
}

// Holiday dates for visual markers
const holidays: Record<string, string> = {
  "1-1": "🎆 New Year",
  "2-14": "❤️ Valentine's",
  "3-17": "🍀 St. Patrick's",
  "7-4": "🇺🇸 Independence",
  "10-31": "🎃 Halloween",
  "12-25": "🎄 Christmas",
};

export function CalendarGrid({ currentMonth, startDate, endDate, onDateClick }: CalendarGridProps) {
  const days = generateCalendarDays(currentMonth);
  const weekdays = getWeekdayHeaders();

  return (
    <div className="p-4 sm:p-6 md:p-8">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2 md:gap-3 text-center text-[10px] sm:text-xs font-bold text-gray-500 mb-4 sm:mb-6 uppercase tracking-widest">
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
          const isHoliday = holidays[dateKey];

          return (
            <motion.button
              key={day.toISOString()}
              onClick={() => onDateClick(day)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.01 }}
              whileHover={{ scale: isCurrentMonthDay ? 1.1 : 1, y: isCurrentMonthDay ? -4 : 0 }}
              whileTap={{ scale: 0.92 }}
              className={cn(
                "aspect-square flex flex-col items-center justify-center rounded-lg sm:rounded-xl md:rounded-2xl text-[11px] sm:text-sm font-semibold transition-all duration-300 relative overflow-hidden",
                !isCurrentMonthDay && "text-gray-300 cursor-default",
                isCurrentMonthDay && "cursor-pointer",
                today && !isStart && !isEnd && "ring-2 ring-amber-400 bg-gradient-to-br from-amber-50 to-amber-100 text-amber-900",
                isStart || isEnd
                  ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg"
                  : inRange
                  ? "bg-gradient-to-br from-blue-100 to-blue-50 text-blue-700"
                  : isCurrentMonthDay && "hover:bg-gray-50 text-gray-700",
              )}
            >
              <span className="text-xs sm:text-sm">{format(day, "d")}</span>
              {isHoliday && (
                <motion.span
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-[7px] sm:text-[9px] leading-none mt-0.5 sm:mt-1"
                >
                  {isHoliday.split(" ")[0]}
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
