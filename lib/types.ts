/**
 * Calendar Component Types
 * Comprehensive TypeScript interfaces for type safety
 */

// ── Event / Note created from a date selection ──
export interface CalendarEvent {
  id: string;
  title: string;
  location: string;     // "n/a" when not provided
  description: string;
  tag: string;          // PERSONAL | WORK | DREAM | EVENT | TRAVEL
  startDate: string;    // "yyyy-MM-dd"
  endDate: string;      // "yyyy-MM-dd"
  createdAt: string;    // ISO timestamp
}

export interface CalendarGridProps {
  currentMonth: Date;
  startDate: Date | null;
  endDate: Date | null;
  onDateClick: (day: Date) => void;
}

export interface HeroImageProps {
  currentMonth: Date;
  imageUrl: string;
  monthIndex: number;
  onUpload: (monthIndex: number, dataUrl: string) => void;
  onReset: (monthIndex: number) => void;
}

export interface NotesPanelProps {
  startDate: Date | null;
  endDate: Date | null;
  monthIndex: number;
}

export interface CalendarNote {
  monthIndex: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RangeNote {
  startDate: Date;
  endDate: Date;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface HeroImage {
  monthIndex: number;
  dataUrl: string;
  uploadedAt: Date;
}

export interface Holiday {
  month: number;
  day: number;
  emoji: string;
  name: string;
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface CalendarState {
  currentMonth: Date;
  startDate: Date | null;
  endDate: Date | null;
  generalNotes: Record<number, string>;
  rangeNotes: Record<string, string>;
  customImages: Record<number, string>;
}

export const HOLIDAYS: Holiday[] = [
  // US Holidays
  { month: 1, day: 1, emoji: "🎆", name: "New Year" },
  { month: 2, day: 14, emoji: "❤️", name: "Valentine's Day" },
  { month: 3, day: 17, emoji: "🍀", name: "St. Patrick's Day" },
  { month: 7, day: 4, emoji: "🇺🇸", name: "Independence Day" },
  { month: 10, day: 31, emoji: "🎃", name: "Halloween" },
  { month: 12, day: 25, emoji: "🎄", name: "Christmas" },
  
  // Indian Holidays
  { month: 1, day: 26, emoji: "🇮🇳", name: "Republic Day" },
  { month: 3, day: 8, emoji: "🪔", name: "Maha Shivaratri" },
  { month: 3, day: 25, emoji: "🌸", name: "Holi" },
  { month: 4, day: 14, emoji: "🌾", name: "Ambedkar Jayanti" },
  { month: 4, day: 17, emoji: "🧧", name: "Ram Navami" },
  { month: 4, day: 21, emoji: "🕯️", name: "Mahavir Jayanti" },
  { month: 8, day: 15, emoji: "🇮🇳", name: "Independence Day" },
  { month: 8, day: 26, emoji: "🎶", name: "Janmashtami" },
  { month: 9, day: 16, emoji: "🚀", name: "Milad un-Nabi" },
  { month: 10, day: 2, emoji: "🧵", name: "Gandhi Jayanti" },
  { month: 10, day: 12, emoji: "🪔", name: "Dussehra" },
  { month: 10, day: 31, emoji: "🪔", name: "Diwali" },
  { month: 11, day: 1, emoji: "💝", name: "Govardhan Puja" },
  { month: 11, day: 15, emoji: "🪔", name: "Guru Nanak Jayanti" },
];