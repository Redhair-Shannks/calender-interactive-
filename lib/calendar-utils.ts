import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  format,
  isSameMonth,
  isSameDay,
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
  if (!endDate || isSameDay(startDate, endDate)) {
    return format(startDate, "MMM dd, yyyy");
  }
  return `${format(startDate, "MMM dd")} – ${format(endDate, "MMM dd, yyyy")}`;
}

// ✅ NOW USES YEAR FOR MONTHLY MEMOS + RANGE NOTES
export function hasNoteOnDate(date: Date): boolean {
  const dateStr = format(date, 'yyyy-MM-dd');
  const year = date.getFullYear();
  const monthIndex = date.getMonth();

  // General notes (now year-aware)
  const generalNote = localStorage.getItem(`calendar-general-notes-${year}-${monthIndex}`);
  if (generalNote?.trim()) return true;

  // Range notes
  const rangeNotesStr = localStorage.getItem("calendar-range-notes");
  if (rangeNotesStr) {
    try {
      const rangeNotes = JSON.parse(rangeNotesStr);
      for (const [key, value] of Object.entries(rangeNotes)) {
        if (typeof value === 'string' && value.trim()) {
          const parts = key.split('-to-');
          if (parts.length === 2) {
            const start = new Date(parts[0]);
            const end = new Date(parts[1]);
            if (date >= start && date <= end) return true;
          }
        }
      }
    } catch (e) {}
  }
  return false;
}