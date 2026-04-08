"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { format, addMonths, subMonths, isSameDay } from "date-fns";
import { CalendarGrid } from "./CalendarGrid";
import { NotesPanel } from "./NotesPanel";
import { ChevronLeft, ChevronRight, Moon, Sun, Upload, RotateCcw, ImageIcon, Link as LinkIcon, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDateRange } from "@/lib/calendar-utils";
import { useTheme } from "@/lib/theme-context";

type Direction = "next" | "prev";

const MONTH_IMAGES: Record<number, string> = {
  0: "https://images.unsplash.com/photo-1451776965373-b4f516ac20ec?w=1600&q=80",  // Jan – snowy forest
  1: "https://images.unsplash.com/photo-1477601263568-180e2c6d046e?w=1600&q=80",  // Feb – frost
  2: "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=1600&q=80",  // Mar – spring bloom
  3: "https://images.unsplash.com/photo-1490750967868-88df5691cc9e?w=1600&q=80",  // Apr – flowers
  4: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1600&q=80",  // May – green meadow
  5: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80",  // Jun – beach
  6: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=1600&q=80",  // Jul – summer
  7: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1600&q=80",  // Aug – field
  8: "https://images.unsplash.com/photo-1508779018-4f3fc9ea2e0c?w=1600&q=80",  // Sep – autumn
  9: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80",  // Oct – mountains autumn
  10: "https://images.unsplash.com/photo-1457269449834-928af64c684d?w=1600&q=80", // Nov – misty trees
  11: "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?w=1600&q=80", // Dec – winter
};

export default function InteractiveCalendar() {
  const { isDark, toggleDarkMode } = useTheme();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [customImages, setCustomImages] = useState<Record<number, string>>({});
  const [rangeNotes, setRangeNotes] = useState<Record<string, string>>({});
  const [direction, setDirection] = useState<Direction>("next");
  const [selectionStep, setSelectionStep] = useState<0 | 1 | 2>(0);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [imgKey, setImgKey] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const defaultImage = MONTH_IMAGES[monthIndex] || `https://picsum.photos/id/${1000 + monthIndex}/1600/900`;
  const currentImage = customImages[monthIndex] || defaultImage;

  const handleDateClick = useCallback((day: Date) => {
    if (selectionStep === 0 || selectionStep === 2) {
      setStartDate(day);
      setEndDate(null);
      setSelectionStep(1);
    } else if (selectionStep === 1) {
      if (isSameDay(day, startDate!)) {
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setCustomImages((prev) => ({ ...prev, [monthIndex]: dataUrl }));
      localStorage.setItem(`hero-image-${monthIndex}`, dataUrl);
      setImgKey((k) => k + 1);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleUrlApply = () => {
    const trimmed = urlInput.trim();
    if (trimmed) {
      setCustomImages((prev) => ({ ...prev, [monthIndex]: trimmed }));
      localStorage.setItem(`hero-image-${monthIndex}`, trimmed);
      setUrlInput("");
      setShowUrlInput(false);
      setImgKey((k) => k + 1);
    }
  };

  const handleResetImage = () => {
    setCustomImages((prev) => {
      const newImages = { ...prev };
      delete newImages[monthIndex];
      return newImages;
    });
    localStorage.removeItem(`hero-image-${monthIndex}`);
    setImgKey((k) => k + 1);
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
      x: dir === "next" ? 40 : -40,
    }),
    center: { opacity: 1, x: 0 },
    exit: (dir: Direction) => ({
      opacity: 0,
      x: dir === "next" ? -40 : 40,
    }),
  };

  const selectionHint =
    selectionStep === 0
      ? "Click any date to start selecting"
      : selectionStep === 1
      ? "Click another date for a range • Click same date for single day"
      : null;

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-3 sm:p-6 md:p-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-5xl"
      >
        {/* ── Spiral binding ── */}
        <SpiralBinding isDark={isDark} />

        {/* ── Main calendar card ── */}
        <div
          className={`relative overflow-hidden rounded-b-3xl shadow-[0_32px_80px_-12px_rgba(0,0,0,0.35)] ${
            isDark ? "bg-gray-900" : "bg-white"
          }`}
          style={{ minHeight: "520px" }}
        >
          {/* ─── Hero image as full background ─── */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <motion.img
              key={`${currentImage}-${imgKey}`}
              src={currentImage}
              alt={`${format(currentMonth, "MMMM")} calendar photo`}
              initial={{ scale: 1.06, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.4, ease: "easeOut" }}
              className="w-full h-full object-cover"
            />
            {/* Light overlay so text stays readable */}
            <div
              className="absolute inset-0"
              style={{
                background: isDark
                  ? "linear-gradient(135deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.30) 50%, rgba(0,0,0,0.60) 100%)"
                  : "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.08) 45%, rgba(255,255,255,0.55) 100%)",
              }}
            />
          </div>

          {/* ─── Top toolbar: prev / title / dark-mode / next ─── */}
          <div className="relative z-20 flex items-center justify-between px-4 sm:px-6 pt-4 pb-2">
            {/* Prev */}
            <motion.button
              whileHover={{ scale: 1.15, x: -2 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevMonth}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/35 transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-5 w-5" />
            </motion.button>

            {/* Image controls (center-left) */}
            <div className="flex items-center gap-1.5 flex-1 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.93 }}
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-black/30 backdrop-blur-md text-white text-[11px] font-semibold hover:bg-black/45 transition-colors"
              >
                <ImageIcon className="h-3 w-3" />
                <span className="hidden sm:inline">Change Photo</span>
                <span className="sm:hidden">Photo</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.93 }}
                onClick={() => setShowUrlInput((v) => !v)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl backdrop-blur-md text-white text-[11px] font-semibold transition-colors ${
                  showUrlInput ? "bg-blue-600/80" : "bg-black/30 hover:bg-black/45"
                }`}
              >
                <LinkIcon className="h-3 w-3" />
                <span className="hidden sm:inline">URL</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.93 }}
                onClick={handleResetImage}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-black/30 backdrop-blur-md text-white text-[11px] font-semibold hover:bg-black/45 transition-colors"
              >
                <RotateCcw className="h-3 w-3" />
                <span className="hidden sm:inline">Reset</span>
              </motion.button>
            </div>

            {/* Dark mode + Next */}
            <div className="flex items-center gap-1">
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleDarkMode}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/35 transition-colors"
                aria-label="Toggle dark mode"
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.15, x: 2 }}
                whileTap={{ scale: 0.9 }}
                onClick={nextMonth}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/35 transition-colors"
                aria-label="Next month"
              >
                <ChevronRight className="h-5 w-5" />
              </motion.button>
            </div>
          </div>

          {/* URL input bar */}
          <AnimatePresence>
            {showUrlInput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="relative z-20 px-4 sm:px-6 overflow-hidden"
              >
                <div className="flex gap-2 pb-2">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleUrlApply()}
                    placeholder="https://images.unsplash.com/…"
                    autoFocus
                    className="flex-1 px-3 py-2 text-xs rounded-xl bg-white/90 backdrop-blur-md border border-white/40 focus:outline-none focus:bg-white text-gray-800"
                  />
                  <button
                    onClick={handleUrlApply}
                    className="px-3 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
                  >
                    Apply
                  </button>
                  <button
                    onClick={() => { setShowUrlInput(false); setUrlInput(""); }}
                    className="px-2.5 py-2 rounded-xl bg-white/20 text-white hover:bg-white/35 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ─── Month name (top-right wall-calendar style) ─── */}
          <div className="relative z-10 flex">
            {/* Left: empty spacer for the image to show through */}
            <div className="flex-1 hidden md:block" />

            {/* Right: month title + calendar grid + notes */}
            <div className="w-full md:w-[52%] flex flex-col">
              {/* Month heading */}
              <div className="px-5 sm:px-7 pt-2 pb-1 select-none">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={format(currentMonth, "MMMM-yyyy")}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-start"
                  >
                    <h1
                      className="text-5xl sm:text-6xl md:text-7xl font-black leading-none tracking-tight text-white drop-shadow-lg"
                      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
                    >
                      {format(currentMonth, "MMMM")}
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm text-white/80 font-semibold tracking-widest">
                        {format(currentMonth, "yyyy")}
                      </p>
                      {noteCount > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="px-2 py-0.5 text-xs font-bold rounded-full bg-amber-400/90 text-amber-900"
                        >
                          {noteCount} {noteCount === 1 ? "note" : "notes"}
                        </motion.span>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Selection hint */}
              <AnimatePresence>
                {selectionHint && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-5 sm:px-7 overflow-hidden"
                  >
                    <p className={`text-[11px] font-semibold py-1 ${
                      selectionStep === 1 ? "text-blue-200" : "text-white/50"
                    }`}>
                      {selectionHint}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Calendar grid ── */}
              <div className="relative z-10">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={currentMonth.toISOString()}
                    custom={direction}
                    variants={pageVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] }}
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
              </div>

              {/* Selected range bar */}
              <AnimatePresence>
                {startDate && (
                  <motion.div
                    ref={rangeBarRef}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.22 }}
                    className="mx-4 sm:mx-6 mb-3 rounded-2xl flex items-center justify-between gap-2 px-4 py-2.5 bg-white/15 backdrop-blur-md border border-white/25"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold flex-shrink-0 ${
                        selectionStep === 2 ? "bg-blue-500 text-white" : "bg-amber-400 text-amber-900"
                      }`}>
                        {selectionStep === 2 ? "✓" : "…"}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-white truncate">
                        {formatDateRange(startDate, endDate)}
                      </span>
                    </div>
                    <button
                      onClick={clearSelection}
                      className="text-xs font-semibold px-2.5 py-1 rounded-xl text-white/60 hover:text-white hover:bg-white/20 transition-colors flex-shrink-0"
                    >
                      Clear
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Notes panel below the dates ── */}
              <div
                className={`mx-4 sm:mx-6 mb-5 rounded-2xl overflow-hidden ${
                  isDark
                    ? "bg-gray-900/80 backdrop-blur-xl border border-gray-700/60"
                    : "bg-white/80 backdrop-blur-xl border border-white/60"
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
            </div>
          </div>
        </div>

        {/* Bottom page fold effect */}
        <div
          className={`h-4 rounded-b-3xl mx-2 shadow-sm ${
            isDark ? "bg-gray-800" : "bg-gray-100"
          }`}
        />
        <div
          className={`h-2 rounded-b-3xl mx-5 shadow-sm ${
            isDark ? "bg-gray-700" : "bg-gray-200"
          }`}
        />
      </motion.div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
}

function SpiralBinding({ isDark }: { isDark: boolean }) {
  return (
    <div
      className={`relative flex items-end justify-center gap-[12px] sm:gap-[16px] px-8 pt-2 pb-3 rounded-t-3xl z-10 ${
        isDark ? "bg-gray-800" : "bg-[#e8e4df]"
      }`}
    >
      <div
        className={`absolute bottom-0 left-0 right-0 h-[5px] ${
          isDark ? "bg-gray-700" : "bg-[#d4cfc9]"
        }`}
      />
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ delay: i * 0.018, duration: 0.3, ease: "backOut" }}
          className="relative flex flex-col items-center"
          style={{ transformOrigin: "bottom" }}
        >
          <div
            className={`w-[13px] sm:w-[15px] h-[13px] sm:h-[15px] rounded-full border-[2.5px] ${
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
            className={`w-[3px] h-[7px] -mt-[1px] ${
              isDark ? "bg-gray-600" : "bg-[#aaa]"
            }`}
          />
        </motion.div>
      ))}
    </div>
  );
}