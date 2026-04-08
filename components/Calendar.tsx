"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { format, addMonths, subMonths, isSameDay, parseISO } from "date-fns";
import { CalendarGrid } from "./CalendarGrid";
import { NotesPanel } from "./NotesPanel";
import { UpcomingEvents } from "./UpcomingEvents";
import {
  ChevronLeft, ChevronRight, Moon, Sun,
  ImageIcon, Link as LinkIcon, RotateCcw, X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDateRange } from "@/lib/calendar-utils";
import { useTheme } from "@/lib/theme-context";
import { CalendarEvent } from "@/lib/types";

type Direction = "next" | "prev";

// ── Month default images ─────────────────────────────────────────────────────
const MONTH_IMAGES: Record<number, string> = {
  0:  "https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=1600&q=80",
  1:  "https://images.unsplash.com/photo-1477601263568-180e2c6d046e?w=1600&q=80",
  2:  "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=1600&q=80",
  3:  "https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?w=1600&q=80",
  4:  "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1600&q=80",
  5:  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80",
  6:  "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=1600&q=80",
  7:  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1600&q=80",
  8:  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&q=80",
  9:  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80",
  10: "https://images.unsplash.com/photo-1457269449834-928af64c684d?w=1600&q=80",
  11: "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?w=1600&q=80",
};

// ── Main component ────────────────────────────────────────────────────────────
export default function InteractiveCalendar() {
  const { isDark, toggleDarkMode } = useTheme();

  // Calendar state
  const [currentMonth,  setCurrentMonth]  = useState(new Date());
  const [startDate,     setStartDate]     = useState<Date | null>(null);
  const [endDate,       setEndDate]       = useState<Date | null>(null);
  const [direction,     setDirection]     = useState<Direction>("next");
  const [selectionStep, setSelectionStep] = useState<0 | 1 | 2>(0);

  // Image state
  const [customImages, setCustomImages] = useState<Record<number, string>>({});
  const [imgKey,       setImgKey]       = useState(0);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput,     setUrlInput]     = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Events / notes state
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [memoUpdateTrigger, setMemoUpdateTrigger] = useState(0);

  const rangeBarRef = useRef<HTMLDivElement>(null);

  // ── Load persisted data ────────────────────────────────────────────────────
  useEffect(() => {
    // Custom images
    const loaded: Record<number, string> = {};
    for (let i = 0; i < 12; i++) {
      const saved = localStorage.getItem(`hero-image-${i}`);
      if (saved) loaded[i] = saved;
    }
    setCustomImages(loaded);

    // Events
    const savedEvents = localStorage.getItem("calendar-events");
    if (savedEvents) setEvents(JSON.parse(savedEvents));
  }, []);

  // ── Derived values ─────────────────────────────────────────────────────────
  const monthIndex   = currentMonth.getMonth();
  const currentYear  = currentMonth.getFullYear();
  const defaultImage = MONTH_IMAGES[monthIndex] ?? `https://picsum.photos/id/${1000 + monthIndex}/1600/900`;
  const currentImage = customImages[monthIndex] ?? defaultImage;

  // How many events fall in the current month
  const noteCount = events.filter((e) => {
    const d = parseISO(e.startDate);
    return d.getMonth() === monthIndex && d.getFullYear() === currentYear;
  }).length;

  // ── Date selection ─────────────────────────────────────────────────────────
  const handleDateClick = useCallback(
    (day: Date) => {
      if (selectionStep === 0 || selectionStep === 2) {
        setStartDate(day);
        setEndDate(null);
        setSelectionStep(1);
      } else if (selectionStep === 1) {
        if (isSameDay(day, startDate!)) {
          setEndDate(day);
          setSelectionStep(2);
        } else if (day < startDate!) {
          setStartDate(day);
          setEndDate(startDate!);
          setSelectionStep(2);
        } else {
          setEndDate(day);
          setSelectionStep(2);
        }
        setTimeout(() =>
          rangeBarRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 100
        );
      }
    },
    [selectionStep, startDate]
  );

  const clearSelection = () => {
    setStartDate(null);
    setEndDate(null);
    setSelectionStep(0);
  };

  // ── Month navigation ───────────────────────────────────────────────────────
  const prevMonth = () => { setDirection("prev"); setCurrentMonth(subMonths(currentMonth, 1)); };
  const nextMonth = () => { setDirection("next"); setCurrentMonth(addMonths(currentMonth, 1)); };

  // ── Image controls ─────────────────────────────────────────────────────────
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setCustomImages((p) => ({ ...p, [monthIndex]: dataUrl }));
      localStorage.setItem(`hero-image-${monthIndex}`, dataUrl);
      setImgKey((k) => k + 1);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleUrlApply = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    setCustomImages((p) => ({ ...p, [monthIndex]: trimmed }));
    localStorage.setItem(`hero-image-${monthIndex}`, trimmed);
    setUrlInput("");
    setShowUrlInput(false);
    setImgKey((k) => k + 1);
  };

  const handleResetImage = () => {
    setCustomImages((p) => { const n = { ...p }; delete n[monthIndex]; return n; });
    localStorage.removeItem(`hero-image-${monthIndex}`);
    setImgKey((k) => k + 1);
  };

  // ── Event handlers ─────────────────────────────────────────────────────────
  const handleEventSaved = (event: CalendarEvent) => {
    setEvents((prev) => [...prev, event]);
  };

  const handleDeleteEvent = (id: string) => {
    const event = events.find((e) => e.id === id);
    if (event) {
      // Remove dot from CalendarGrid
      const rangeKey = `${event.startDate}-to-${event.endDate}`;
      const rangeNotes = JSON.parse(localStorage.getItem("calendar-range-notes") || "{}");
      delete rangeNotes[rangeKey];
      localStorage.setItem("calendar-range-notes", JSON.stringify(rangeNotes));
    }
    const updated = events.filter((e) => e.id !== id);
    setEvents(updated);
    localStorage.setItem("calendar-events", JSON.stringify(updated));
  };

  // ── Animation variants ─────────────────────────────────────────────────────
  const pageVariants = {
  enter: (dir: Direction) => ({
    rotateY: dir === "next" ? 180 : -180,
    opacity: 0,
    zIndex: 0,
  }),

  center: {
    rotateY: 0,
    opacity: 1,
    zIndex: 1,
    transition: {
      duration: 0.65,
      ease: [0.4, 0, 0.2, 1],
    },
  },

  exit: (dir: Direction) => ({
    rotateY: dir === "next" ? -180 : 180,
    opacity: 0.6,
    zIndex: 2,
    transition: {
      duration: 0.65,
      ease: [0.4, 0, 0.2, 1],
    },
  }),
};

  const selectionHint =
    selectionStep === 0 ? "Click any date to start selecting"
    : selectionStep === 1 ? "Click another date for a range • Click same date for single day"
    : null;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-6xl mx-auto space-y-6"
      >
        {/* ════════════════════════════════════
            HERO CALENDAR CARD
        ════════════════════════════════════ */}
        <div>
          <SpiralBinding isDark={isDark} />

          <div
            className="relative overflow-hidden rounded-b-3xl shadow-[0_32px_80px_-12px_rgba(0,0,0,0.4)]"
            style={{ minHeight: "480px" }}
          >
            {/* Background image */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <motion.img
                key={`${currentImage}-${imgKey}`}
                src={currentImage}
                alt={`${format(currentMonth, "MMMM")} calendar photo`}
                initial={{ scale: 1.06, opacity: 0 }}
                animate={{ scale: 1,    opacity: 1 }}
                transition={{ duration: 1.4, ease: "easeOut" }}
                className="w-full h-full object-cover"
              />
              {/* Overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: isDark
                    ? "linear-gradient(135deg,rgba(0,0,0,.55) 0%,rgba(0,0,0,.25) 45%,rgba(0,0,0,.60) 100%)"
                    : "linear-gradient(135deg,rgba(255,255,255,.15) 0%,rgba(255,255,255,.05) 45%,rgba(255,255,255,.50) 100%)",
                }}
              />
            </div>

            {/* ── Toolbar ── */}
            <div className="relative z-20 flex items-center justify-between px-4 sm:px-5 pt-4 pb-2">
              {/* Prev */}
              <motion.button
                whileHover={{ scale: 1.15, x: -2 }}
                whileTap={{ scale: 0.9 }}
                onClick={prevMonth}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-black/25 backdrop-blur-md text-white hover:bg-black/40 transition-colors"
                aria-label="Previous month"
              >
                <ChevronLeft className="h-5 w-5" />
              </motion.button>

              {/* Image controls */}
              <div className="flex items-center gap-1.5">
                <ToolbarBtn onClick={() => fileInputRef.current?.click()}>
                  <ImageIcon className="h-3 w-3" />
                  <span className="hidden sm:inline">Change Photo</span>
                  <span className="sm:hidden">Photo</span>
                </ToolbarBtn>
                <ToolbarBtn active={showUrlInput} onClick={() => setShowUrlInput((v) => !v)}>
                  <LinkIcon className="h-3 w-3" />
                  <span className="hidden sm:inline">URL</span>
                </ToolbarBtn>
                <ToolbarBtn onClick={handleResetImage}>
                  <RotateCcw className="h-3 w-3" />
                  <span className="hidden sm:inline">Reset</span>
                </ToolbarBtn>
              </div>

              {/* Dark mode + Next */}
              <div className="flex items-center gap-1">
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleDarkMode}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-black/25 backdrop-blur-md text-white hover:bg-black/40 transition-colors"
                  aria-label="Toggle dark mode"
                >
                  {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.15, x: 2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={nextMonth}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-black/25 backdrop-blur-md text-white hover:bg-black/40 transition-colors"
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
                  className="relative z-20 px-4 sm:px-5 overflow-hidden"
                >
                  <div className="flex gap-2 pb-2">
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleUrlApply()}
                      placeholder="https://images.unsplash.com/…"
                      autoFocus
                      className="flex-1 px-3 py-2 text-xs rounded-xl bg-white/90 backdrop-blur-md border border-white/40 focus:outline-none text-gray-900"
                    />
                    <button
                      onClick={handleUrlApply}
                      className="px-3 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
                    >
                      Apply
                    </button>
                    <button
                      onClick={() => { setShowUrlInput(false); setUrlInput(""); }}
                      className="px-2.5 py-2 rounded-xl bg-black/25 text-white hover:bg-black/40 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Month title + Calendar grid ──
                Desktop: right 55% of card; Mobile: full width */}
            <div className="relative z-10 flex pb-6">
              {/* Left spacer (image shows through on desktop) */}
              <div className="hidden md:block flex-1" />

              {/* Right column: title + grid + selection bar */}
              <div className="w-full md:w-[56%] flex flex-col">
                {/* Month heading */}
                <div className="px-5 sm:px-7 pt-3 pb-1 select-none">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={format(currentMonth, "MMMM-yyyy")}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h1
                        className="text-5xl sm:text-6xl md:text-7xl font-black leading-none tracking-tight text-white drop-shadow-lg"
                        style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                      >
                        {format(currentMonth, "MMMM")}
                      </h1>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm text-white/75 font-semibold tracking-[0.18em] uppercase">
                          {format(currentMonth, "yyyy")}
                        </p>
                        {noteCount > 0 && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="px-2 py-0.5 text-xs font-black rounded-full bg-[#97a9ff] text-gray-900"
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
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`px-5 sm:px-7 text-[11px] font-semibold py-1 overflow-hidden ${
                        selectionStep === 1 ? "text-blue-200" : "text-white/45"
                      }`}
                    >
                      {selectionHint}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Calendar grid */}
                <AnimatePresence mode="popLayout" custom={direction}>
                  <motion.div
                    key={currentMonth.toISOString()}
                    custom={direction}
                    variants={pageVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      duration: 0.65,
                      ease: [0.4, 0, 0.2, 1], // Realistic "material" easing
                    }}
                    style={{
                      perspective: 1400,
                      transformStyle: "preserve-3d",
                      transformOrigin: "top center", // Hinged at the top
                      backfaceVisibility: "hidden",
                    }}
                    className="relative"
                  >
                    {/* Darkening overlay mid-flip */}
                    <motion.div
                      className="absolute inset-0 bg-black/20 pointer-events-none z-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0 }}
                      exit={{ opacity: 0.4 }}
                      transition={{ duration: 0.3 }}
                    />
                    <CalendarGrid
                      currentMonth={currentMonth}
                      startDate={startDate}
                      endDate={endDate}
                      onDateClick={handleDateClick}
                      selectionStep={selectionStep}
                      events={events}
                      memoUpdateTrigger={memoUpdateTrigger}
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Selection summary bar */}
                <AnimatePresence>
                  {startDate && (
                    <motion.div
                      ref={rangeBarRef}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.22 }}
                      className="mx-4 sm:mx-5 mb-2 rounded-2xl flex items-center justify-between gap-2 px-4 py-2.5 bg-white/12 backdrop-blur-md border border-white/20"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span
                          className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-black flex-shrink-0 ${
                            selectionStep === 2
                              ? "bg-[#97a9ff] text-gray-900"
                              : "bg-amber-400 text-amber-900"
                          }`}
                        >
                          {selectionStep === 2 ? "✓" : "…"}
                        </span>
                        <span className="text-xs sm:text-sm font-semibold text-white truncate">
                          {formatDateRange(startDate, endDate)}
                        </span>
                      </div>
                      <button
                        onClick={clearSelection}
                        className="text-xs font-semibold px-2.5 py-1 rounded-xl text-white/55 hover:text-white hover:bg-white/20 transition-colors flex-shrink-0"
                      >
                        Clear
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Page fold shadows */}
          <div className={`h-3 rounded-b-3xl mx-2 ${isDark ? "bg-gray-800/70" : "bg-gray-200/80"}`} />
          <div className={`h-2 rounded-b-3xl mx-5 ${isDark ? "bg-gray-700/50" : "bg-gray-300/50"}`} />
        </div>

        {/* ════════════════════════════════════
            BOTTOM SECTION: Add Note | Events
        ════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Note form — 1/3 */}
          <div className="lg:col-span-1">
            <NotesPanel
              startDate={startDate}
              endDate={endDate}
              monthIndex={monthIndex}
              year={currentYear}
              selectionStep={selectionStep}
              onEventSaved={handleEventSaved}
              onMemoSaved={() => setMemoUpdateTrigger((t) => t + 1)}
            />
          </div>

          {/* Upcoming Events — 2/3 */}
          <div className="lg:col-span-2">
            <UpcomingEvents
              events={events}
              onDelete={handleDeleteEvent}
              monthIndex={monthIndex}
              year={currentYear}
            />
          </div>
        </div>
      </motion.div>

      {/* Hidden file input */}
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

// ── Sub-components ────────────────────────────────────────────────────────────

function ToolbarBtn({
  onClick, active, children,
}: {
  onClick: () => void;
  active?:  boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.93 }}
      onClick={onClick}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold backdrop-blur-md text-white transition-colors ${
        active ? "bg-blue-600/85" : "bg-black/30 hover:bg-black/45"
      }`}
    >
      {children}
    </motion.button>
  );
}

function SpiralBinding({ isDark }: { isDark: boolean }) {
  return (
    <div
      className={`relative flex items-end justify-center gap-[11px] sm:gap-[15px] px-6 pt-2 pb-3 rounded-t-3xl z-10 ${
        isDark ? "bg-gray-800" : "bg-[#e8e4df]"
      }`}
    >
      <div
        className={`absolute bottom-0 left-0 right-0 h-[5px] ${
          isDark ? "bg-gray-700" : "bg-[#d4cfc9]"
        }`}
      />
      {Array.from({ length: 22 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ delay: i * 0.016, duration: 0.28, ease: "backOut" }}
          className="flex flex-col items-center"
          style={{ transformOrigin: "bottom" }}
        >
          <div
            className={`w-[12px] sm:w-[14px] h-[12px] sm:h-[14px] rounded-full border-[2.5px] ${
              isDark ? "border-gray-500 bg-gray-700" : "border-[#999] bg-[#c8c4be]"
            }`}
            style={{
              boxShadow: isDark
                ? "inset 0 1px 2px rgba(0,0,0,.4), 0 1px 0 rgba(255,255,255,.05)"
                : "inset 0 1px 3px rgba(0,0,0,.2), 0 1px 0 rgba(255,255,255,.4)",
            }}
          />
          <div className={`w-[2.5px] h-[7px] -mt-px ${isDark ? "bg-gray-600" : "bg-[#aaa]"}`} />
        </motion.div>
      ))}
    </div>
  );
}