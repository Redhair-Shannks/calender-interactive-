"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { format, addMonths, subMonths, isSameDay } from "date-fns";
import { HeroImage } from "./HeroImage";
import { CalendarGrid } from "./CalendarGrid";
import { NotesPanel } from "./NotesPanel";
import { ChevronLeft, ChevronRight, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { formatDateRange } from "@/lib/calendar-utils";
import { useTheme } from "@/lib/theme-context";

type Direction = "next" | "prev";

export default function InteractiveCalendar() {
  const { isDark, toggleDarkMode } = useTheme();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [customImages, setCustomImages] = useState<Record<number, string>>({});
  const [rangeNotes, setRangeNotes] = useState<Record<string, string>>({});
  const [direction, setDirection] = useState<Direction>("next");
  const [selectionStep, setSelectionStep] = useState<0 | 1 | 2>(0);
  const rangeBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loaded: Record<number, string> = {};
    for (let i = 0; i < 12; i++) {
      const saved = localStorage.getItem(`hero-image-${i}`);
      if (saved) loaded[i] = saved;
    }
    setCustomImages(loaded);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("calendar-range-notes");
    if (saved) setRangeNotes(JSON.parse(saved));
  }, []);

  const monthIndex = currentMonth.getMonth();
  const currentYear = currentMonth.getFullYear();

  const defaultImage = monthIndex === 7
    ? "https://picsum.photos/id/1015/1200/800"
    : `https://picsum.photos/id/${1000 + monthIndex}/1200/800`;
  const currentImage = customImages[monthIndex] || defaultImage;

  // ✅ UPDATED: Full single-day note support
  // - Click once → start selection (step 1)
  // - Click different date → range (step 2)
  // - Click SAME date again → confirm single-day note (step 2)
  const handleDateClick = useCallback((day: Date) => {
    if (selectionStep === 0 || selectionStep === 2) {
      // Start fresh selection
      setStartDate(day);
      setEndDate(null);
      setSelectionStep(1);
    } else if (selectionStep === 1) {
      if (isSameDay(day, startDate!)) {
        // Confirm single day
        setEndDate(day);
        setSelectionStep(2);
        setTimeout(() => {
          rangeBarRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 100);
      } else if (day < startDate!) {
        setStartDate(day);
        setEndDate(startDate!);
        setSelectionStep(2);
        setTimeout(() => {
          rangeBarRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 100);
      } else {
        setEndDate(day);
        setSelectionStep(2);
        setTimeout(() => {
          rangeBarRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 100);
      }
    }
  }, [selectionStep, startDate]);

  const prevMonth = () => {
    setDirection("prev");
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    setDirection("next");
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const clearSelection = () => {
    setStartDate(null);
    setEndDate(null);
    setSelectionStep(0);
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
    enter: (dir: Direction) => ({
      opacity: 0,
      rotateX: dir === "next" ? -8 : 8,
      y: dir === "next" ? 30 : -30,
      scale: 0.97,
      transformOrigin: "top center",
    }),
    center: {
      opacity: 1,
      rotateX: 0,
      y: 0,
      scale: 1,
      transformOrigin: "top center",
    },
    exit: (dir: Direction) => ({
      opacity: 0,
      rotateX: dir === "next" ? 8 : -8,
      y: dir === "next" ? -30 : 30,
      scale: 0.97,
      transformOrigin: "top center",
    }),
  };

  const selectionHint =
    selectionStep === 0
      ? "Click any date to start"
      : selectionStep === 1
      ? "Click another date for range • Click same date again for single day"
      : null;

  return (
    <div className="w-full px-3 sm:px-4 py-8 sm:py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-7xl mx-auto"
      >
        <div
          className={`relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.25)] ${
            isDark ? "bg-gray-900" : "bg-[#fafaf8]"
          }`}
          style={{ perspective: "1200px" }}
        >
          <SpiralBinding isDark={isDark} />

          <div className="pt-4">
            <HeroImage
              currentMonth={currentMonth}
              imageUrl={currentImage}
              monthIndex={monthIndex}
              onUpload={handleCustomImageUpload}
              onReset={handleResetImage}
            />
          </div>

          <div
            className={`flex items-center justify-between px-4 sm:px-8 py-4 sm:py-6 border-b ${
              isDark
                ? "bg-gray-800/80 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <motion.button
              whileHover={{ scale: 1.12, x: -2 }}
              whileTap={{ scale: 0.92 }}
              onClick={prevMonth}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
                isDark ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              <ChevronLeft className="h-5 w-5" />
            </motion.button>

            <div className="text-center flex-1 select-none">
              <AnimatePresence mode="wait">
                <motion.div
                  key={format(currentMonth, "MMMM-yyyy")}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="flex items-center justify-center gap-3">
                    <h2
                      className={`text-2xl sm:text-3xl font-black tracking-tight ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                      style={{ fontFamily: "var(--font-geist-sans, sans-serif)", letterSpacing: "-0.02em" }}
                    >
                      {format(currentMonth, "MMMM")}
                    </h2>
                    {noteCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                          isDark
                            ? "bg-amber-800/60 text-amber-300"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {noteCount} {noteCount === 1 ? "note" : "notes"}
                      </motion.span>
                    )}
                  </div>
                  <p
                    className={`text-xs tracking-[0.2em] font-semibold mt-0.5 uppercase ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    {format(currentMonth, "yyyy")}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-1">
              <motion.button
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.92 }}
                onClick={toggleDarkMode}
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
                  isDark ? "hover:bg-gray-700 text-amber-400" : "hover:bg-gray-100 text-gray-500"
                }`}
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.12, x: 2 }}
                whileTap={{ scale: 0.92 }}
                onClick={nextMonth}
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
                  isDark ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                <ChevronRight className="h-5 w-5" />
              </motion.button>
            </div>
          </div>

          <AnimatePresence>
            {selectionHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className={`overflow-hidden border-b text-center text-xs font-semibold py-2 tracking-wide ${
                  selectionStep === 1
                    ? isDark
                      ? "bg-blue-900/30 border-blue-800 text-blue-300"
                      : "bg-blue-50 border-blue-100 text-blue-600"
                    : isDark
                    ? "bg-gray-800 border-gray-700 text-gray-400"
                    : "bg-gray-50 border-gray-100 text-gray-400"
                }`}
              >
                {selectionHint}
              </motion.div>
            )}
          </AnimatePresence>

          <div
            className={`grid lg:grid-cols-3 ${
              isDark ? "bg-gray-900" : "bg-[#fafaf8]"
            }`}
          >
            <div
              className={`lg:col-span-1 p-4 sm:p-6 md:p-8 lg:border-r order-2 lg:order-1 ${
                isDark ? "border-gray-700/60" : "border-gray-200"
              }`}
            >
              <NotesPanel
                startDate={startDate}
                endDate={endDate}
                monthIndex={monthIndex}
                year={currentYear}
                onNotesSaved={handleNotesSaved}
                selectionStep={selectionStep}
              />
            </div>

            <div className="lg:col-span-2 order-1 lg:order-2" style={{ perspective: "800px" }}>
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentMonth.toISOString()}
                  custom={direction}
                  variants={pageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <CalendarGrid
                    currentMonth={currentMonth}
                    startDate={startDate}
                    endDate={endDate}
                    onDateClick={handleDateClick}
                    selectionStep={selectionStep}
                  />
                </motion.div>
              </AnimatePresence>

              <AnimatePresence>
                {startDate && (
                  <motion.div
                    ref={rangeBarRef}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.25 }}
                    className={`sticky bottom-0 z-20 mx-4 sm:mx-6 md:mx-8 mb-4 sm:mb-6 md:mb-8 rounded-2xl border flex items-center justify-between gap-3 px-4 py-3 ${
                      isDark
                        ? "bg-gray-800 border-blue-700/50 shadow-lg shadow-blue-900/20"
                        : "bg-white border-blue-200 shadow-lg shadow-blue-100/60"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold flex-shrink-0 ${
                          selectionStep === 2
                            ? isDark ? "bg-blue-700 text-white" : "bg-blue-600 text-white"
                            : isDark ? "bg-amber-700 text-white" : "bg-amber-500 text-white"
                        }`}
                      >
                        {selectionStep === 2 ? "✓" : "…"}
                      </span>
                      <span
                        className={`text-xs sm:text-sm font-semibold truncate ${
                          isDark ? "text-gray-200" : "text-gray-700"
                        }`}
                      >
                        {formatDateRange(startDate, endDate)}
                      </span>
                    </div>
                    <button
                      onClick={clearSelection}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-xl flex-shrink-0 transition-colors ${
                        isDark
                          ? "text-gray-400 hover:text-red-400 hover:bg-red-900/20"
                          : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                      }`}
                    >
                      Clear
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div
            className={`h-3 ${
              isDark
                ? "bg-gradient-to-b from-gray-800 to-gray-900"
                : "bg-gradient-to-b from-[#f0ede8] to-[#e8e4df]"
            }`}
          />
        </div>
      </motion.div>
    </div>
  );
}

function SpiralBinding({ isDark }: { isDark: boolean }) {
  return (
    <div
      className={`relative flex items-end justify-center gap-[14px] sm:gap-[18px] px-8 pt-2 pb-3 z-10 ${
        isDark ? "bg-gray-800" : "bg-[#e8e4df]"
      }`}
    >
      <div
        className={`absolute bottom-0 left-0 right-0 h-[6px] ${
          isDark ? "bg-gray-700" : "bg-[#d4cfc9]"
        }`}
      />
      {Array.from({ length: 18 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ delay: i * 0.02, duration: 0.3, ease: "backOut" }}
          className="relative flex flex-col items-center"
          style={{ transformOrigin: "bottom" }}
        >
          <div
            className={`w-[14px] sm:w-[16px] h-[14px] sm:h-[16px] rounded-full border-[2.5px] ${
              isDark
                ? "border-gray-500 bg-gray-700"
                : "border-[#999] bg-[#c8c4be]"
            }`}
            style={{
              boxShadow: isDark
                ? "inset 0 1px 2px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.05)"
                : "inset 0 1px 3px rgba(0,0,0,0.2), 0 1px 0 rgba(255,255,255,0.4)",
            }}
          />
          <div
            className={`w-[3px] h-[8px] -mt-[1px] ${
              isDark ? "bg-gray-600" : "bg-[#aaa]"
            }`}
          />
        </motion.div>
      ))}
    </div>
  );
}