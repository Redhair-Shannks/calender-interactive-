import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  format,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";

export function generateCalendarDays(month: Date) {
  const start = startOfWeek(startOfMonth(month));
  const end = endOfWeek(endOfMonth(month));
  return eachDayOfInterval({ start, end });
}

export function getWeekdayHeaders() {
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
}

export function isInRange(day: Date, startDate: Date | null, endDate: Date | null): boolean {
  if (!startDate || !endDate) return false;
  return day >= startDate && day <= endDate;
}

export function formatDateRange(startDate: Date | null, endDate: Date | null): string {
  if (!startDate) return "";
  
  // Single day → clean "Jan 02, 2026" format
  if (!endDate || isSameDay(startDate, endDate)) {
    return format(startDate, "MMM dd, yyyy");
  }
  
  // Proper range → "Jan 02 – Jan 04, 2026"
  return `${format(startDate, "MMM dd")} – ${format(endDate, "MMM dd, yyyy")}`;
}