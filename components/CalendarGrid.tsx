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

export function CalendarGrid({ currentMonth, startDate, endDate, onDateClick }: CalendarGridProps) {
  const days = generateCalendarDays(currentMonth);
  const weekdays = getWeekdayHeaders();

  return (
    <div className="p-6">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-400 mb-4">
        {weekdays.map((day) => (
          <div key={day} className="py-2">{day}</div>
        ))}
      </div>

      {/* Date grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const isCurrentMonthDay = isSameMonth(day, currentMonth);
          const isStart = startDate && isSameDay(day, startDate);
          const isEnd = endDate && isSameDay(day, endDate);
          const inRange = isInRange(day, startDate, endDate);
          const today = isSameDay(day, new Date());

          return (
            <motion.button
              key={day.toISOString()}
              onClick={() => onDateClick(day)}
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "aspect-square flex items-center justify-center rounded-2xl text-sm font-medium transition-all",
                !isCurrentMonthDay && "text-gray-300",
                today && "ring-2 ring-amber-400 bg-amber-50",
                isStart || isEnd
                  ? "bg-blue-600 text-white shadow-md"
                  : inRange
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-gray-100",
              )}
            >
              {format(day, "d")}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}