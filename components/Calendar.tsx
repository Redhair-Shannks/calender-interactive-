"use client";

import { useState, useEffect } from "react";
import { format, addMonths, subMonths, isSameDay } from "date-fns";
import { HeroImage } from "./HeroImage";
import { CalendarGrid } from "./CalendarGrid";
import { NotesPanel } from "./NotesPanel";
import { ChevronLeft, ChevronRight, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { formatDateRange } from "@/lib/calendar-utils";
import { useTheme } from "@/lib/theme-context";

export default function InteractiveCalendar() {
  const { isDark, toggleDarkMode } = useTheme();

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [customImages, setCustomImages] = useState<Record<number, string>>({});
  const [rangeNotes, setRangeNotes] = useState<Record<string, string>>({});

  // Load custom images from localStorage
  useEffect(() => {
    const loaded: Record<number, string> = {};
    for (let i = 0; i < 12; i++) {
      const saved = localStorage.getItem(`hero-image-${i}`);
      if (saved) loaded[i] = saved;
    }
    setCustomImages(loaded);
  }, []);

  // Load range notes
  useEffect(() => {
    const saved = localStorage.getItem("calendar-range-notes");
    if (saved) setRangeNotes(JSON.parse(saved));
  }, []);

  const monthIndex = currentMonth.getMonth();
  const currentYear = currentMonth.getFullYear();   // ← Used for year-aware notes

  // Different default image for August
  const defaultImage = monthIndex === 7
    ? "https://picsum.photos/id/1015/1200/800"
    : `https://picsum.photos/id/${1000 + monthIndex}/1200/800`;

  const currentImage = customImages[monthIndex] || defaultImage;

  const handleDateClick = (day: Date) => {
    if (!startDate) {
      setStartDate(day);
      setEndDate(day);
    } else if (startDate && endDate && isSameDay(startDate, endDate)) {
      if (isSameDay(day, startDate)) {
        setStartDate(null);
        setEndDate(null);
      } else {
        if (day < startDate) {
          setEndDate(startDate);
          setStartDate(day);
        } else {
          setEndDate(day);
        }
      }
    } else {
      setStartDate(day);
      setEndDate(day);
    }
  };

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const clearSelection = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const handleCustomImageUpload = (monthIdx: number, dataUrl: string) => {
    setCustomImages((prev) => ({ ...prev, [monthIdx]: dataUrl }));
    localStorage.setItem(`hero-image-${monthIdx}`, dataUrl);
  };

  const handleResetImage = (monthIdx: number) => {
    setCustomImages((prev) => {
      const newImages = { ...prev };
      delete newImages[monthIdx];
      return newImages;
    });
    localStorage.removeItem(`hero-image-${monthIdx}`);
  };

  // ✅ FIXED: Note count now checks both month AND year
  const noteCount = Object.keys(rangeNotes).filter((key) => {
    const parts = key.split("-to-");
    if (parts.length !== 2) return false;
    const date = new Date(parts[0]);
    return date.getMonth() === monthIndex && date.getFullYear() === currentYear;
  }).length;

  const handleNotesSaved = () => {
    const saved = localStorage.getItem("calendar-range-notes");
    if (saved) setRangeNotes(JSON.parse(saved));
  };

  const pageVariants = {
    enter: { opacity: 0, x: 60, rotateY: 15 },
    center: { opacity: 1, x: 0, rotateY: 0 },
    exit: { opacity: 0, x: -60, rotateY: -15 },
  };

  return (
    <div className="w-full px-3 sm:px-4 py-8 sm:py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto"
      >
        <Card className="overflow-hidden border-0 shadow-2xl rounded-2xl sm:rounded-3xl bg-white dark:bg-gray-900 backdrop-blur-xl">
          {/* Hero Image */}
          <HeroImage
            currentMonth={currentMonth}
            imageUrl={currentImage}
            monthIndex={monthIndex}
            onUpload={handleCustomImageUpload}
            onReset={handleResetImage}
          />

          {/* Month Header */}
          <div
            className={`flex items-center justify-between px-4 sm:px-8 py-5 sm:py-7 bg-gradient-to-r ${
              isDark ? "from-gray-800 to-gray-800/50" : "from-white to-blue-50/30"
            } border-b ${isDark ? "border-gray-700" : "border-gray-100"}`}
          >
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="icon" onClick={prevMonth} className="h-9 w-9 sm:h-10 sm:w-10">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </motion.div>

            <div className="text-center flex-1">
              <div className="flex items-center justify-center gap-3">
                <h2
                  className={`text-2xl sm:text-3xl font-bold tracking-tight ${
                    isDark ? "text-gray-50" : "text-gray-900"
                  }`}
                >
                  {format(currentMonth, "MMMM")}
                </h2>
                {noteCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="px-3 py-1 text-xs font-semibold bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 rounded-full"
                  >
                    {noteCount} note{noteCount > 1 ? "s" : ""}
                  </motion.span>
                )}
              </div>
              <p
                className={`text-xs tracking-widest mt-1 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {format(currentMonth, "yyyy")}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleDarkMode}
                  className="h-9 w-9 sm:h-10 sm:w-10"
                >
                  {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="icon" onClick={nextMonth} className="h-9 w-9 sm:h-10 sm:w-10">
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </motion.div>
            </div>
          </div>

          <div className={`grid lg:grid-cols-3 ${isDark ? "bg-gray-900" : "bg-white"}`}>
            {/* Notes Panel - now receives year */}
            <div
              className={`lg:col-span-1 p-4 sm:p-6 md:p-8 lg:border-r ${
                isDark ? "border-gray-700" : "border-gray-100"
              } order-2 lg:order-1`}
            >
              <NotesPanel
                startDate={startDate}
                endDate={endDate}
                monthIndex={monthIndex}
                year={currentYear}
                onNotesSaved={handleNotesSaved}
              />
            </div>

            {/* Calendar Grid */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentMonth.toISOString()}
                  variants={pageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  <CalendarGrid
                    currentMonth={currentMonth}
                    startDate={startDate}
                    endDate={endDate}
                    onDateClick={handleDateClick}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Selected Range Bar */}
              <AnimatePresence>
                {startDate && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 md:pb-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4"
                  >
                    <div className="text-xs sm:text-sm font-semibold text-blue-700 bg-gradient-to-r from-blue-50 to-blue-100 px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-blue-200 flex-1 text-center sm:text-left">
                      ✨ {formatDateRange(startDate, endDate)}
                    </div>
                    <Button
                      variant="ghost"
                      onClick={clearSelection}
                      className="text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all rounded-full text-xs sm:text-sm"
                    >
                      Clear
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}