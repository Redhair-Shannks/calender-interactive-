/**
 * Calendar Component Types
 * Comprehensive TypeScript interfaces for type safety
 */

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
  { month: 1, day: 1, emoji: "🎆", name: "New Year" },
  { month: 2, day: 14, emoji: "❤️", name: "Valentine's Day" },
  { month: 3, day: 17, emoji: "🍀", name: "St. Patrick's Day" },
  { month: 7, day: 4, emoji: "🇺🇸", name: "Independence Day" },
  { month: 10, day: 31, emoji: "🎃", name: "Halloween" },
  { month: 12, day: 25, emoji: "🎄", name: "Christmas" },
];
