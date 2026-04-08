"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/lib/theme-context";
import { format, isSameDay } from "date-fns";
import { formatDateRange } from "@/lib/calendar-utils";
import { CalendarEvent } from "@/lib/types";
import { Check, MapPin, BookOpen, MousePointerClick, FileText } from "lucide-react";

// ── Tag config ──────────────────────────────────────────────────────────────
const TAGS = ["PERSONAL", "WORK", "DREAM", "EVENT", "TRAVEL"] as const;
type Tag = (typeof TAGS)[number];

const TAG_COLORS: Record<Tag, string> = {
  PERSONAL: "#97a9ff",
  WORK:     "#4ade80",
  DREAM:    "#f472b6",
  EVENT:    "#fb923c",
  TRAVEL:   "#34d399",
};

// ── Monthly Memo helpers ──────────────────────────────────────────────────────
function memoKey(monthIndex: number, year: number) {
  return `monthly-memo-${year}-${monthIndex}`;
}

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

// ── Props ────────────────────────────────────────────────────────────────────
interface NotesPanelProps {
  startDate:     Date | null;
  endDate:       Date | null;
  monthIndex:    number;
  year:          number;
  selectionStep: 0 | 1 | 2;
  onEventSaved?: (event: CalendarEvent) => void;
}

// ── Component ────────────────────────────────────────────────────────────────
export function NotesPanel({
  startDate,
  endDate,
  monthIndex,
  year,
  selectionStep,
  onEventSaved,
}: NotesPanelProps) {
  const { isDark } = useTheme();

  // ── Tab state ──────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<"note" | "memo">("note");

  // ── Specific Note state ───────────────────────────────────────────────────
  const [title,       setTitle]       = useState("");
  const [location,    setLocation]    = useState("");
  const [description, setDescription] = useState("");
  const [selectedTag, setSelectedTag] = useState<Tag>("PERSONAL");
  const [justSaved,   setJustSaved]   = useState(false);

  // ── Monthly Memo state ────────────────────────────────────────────────────
  const [memoText,    setMemoText]    = useState("");
  const [memoSaved,   setMemoSaved]   = useState(false);

  // Load memo from localStorage whenever month/year changes
  useEffect(() => {
    const saved = localStorage.getItem(memoKey(monthIndex, year));
    setMemoText(saved ?? "");
  }, [monthIndex, year]);

  const hasSelection = selectionStep === 2 && !!startDate && !!endDate;
  const isSingleDay  = hasSelection && isSameDay(startDate!, endDate!);

  // ── Save Note handler ─────────────────────────────────────────────────────
  const handleSave = () => {
    if (!title.trim() || !startDate || !endDate) return;

    const event: CalendarEvent = {
      id:          crypto.randomUUID(),
      title:       title.trim(),
      location:    location.trim() || "n/a",
      description: description.trim(),
      tag:         selectedTag,
      startDate:   format(startDate, "yyyy-MM-dd"),
      endDate:     format(endDate,   "yyyy-MM-dd"),
      createdAt:   new Date().toISOString(),
    };

    const existing: CalendarEvent[] = JSON.parse(
      localStorage.getItem("calendar-events") || "[]"
    );
    existing.push(event);
    localStorage.setItem("calendar-events", JSON.stringify(existing));

    const rangeKey = `${event.startDate}-to-${event.endDate}`;
    const rangeNotes = JSON.parse(localStorage.getItem("calendar-range-notes") || "{}");
    rangeNotes[rangeKey] = title.trim();
    localStorage.setItem("calendar-range-notes", JSON.stringify(rangeNotes));

    setTitle("");
    setLocation("");
    setDescription("");
    setSelectedTag("PERSONAL");
    setJustSaved(true);
    onEventSaved?.(event);
    setTimeout(() => setJustSaved(false), 2500);
  };

  // ── Save Memo handler ─────────────────────────────────────────────────────
  const handleSaveMemo = () => {
    localStorage.setItem(memoKey(monthIndex, year), memoText);
    setMemoSaved(true);
    setTimeout(() => setMemoSaved(false), 2500);
  };

  // ── Input classes ──────────────────────────────────────────────────────────
  const inputCls = isDark
    ? "bg-gray-800/60 text-gray-100 placeholder:text-gray-500 border border-gray-700/50 focus:border-blue-600/60 focus:bg-gray-800"
    : "bg-white/70 text-gray-900 placeholder:text-gray-400 border border-gray-200 focus:border-blue-400 focus:bg-white";

  const tabBase = "flex-1 py-3 text-sm font-bold uppercase tracking-widest transition-colors";
  const tabActive = isDark
    ? "text-blue-400 border-b-2 border-blue-400 bg-blue-900/10"
    : "text-blue-600 border-b-2 border-blue-500 bg-blue-50/60";
  const tabInactive = isDark
    ? "text-gray-500 hover:text-gray-300 border-b border-gray-800"
    : "text-black hover:text-gray-600 border-b border-gray-200";

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      className={`rounded-3xl flex flex-col min-h-[480px] overflow-hidden ${
        isDark
          ? "bg-gray-900/60 backdrop-blur-xl border border-white/8 shadow-2xl shadow-black/40"
          : "bg-white/60 backdrop-blur-xl border border-black/8 shadow-xl shadow-black/10"
      }`}
    >
      {/* ── Tabs ── */}
      <div className={`flex border-b ${isDark ? "border-gray-800" : "border-gray-200"}`}>
        <button
          className={`${tabBase} ${activeTab === "note" ? tabActive : tabInactive}`}
          onClick={() => setActiveTab("note")}
        >
          Specific Note
        </button>
        <button
          className={`${tabBase} ${activeTab === "memo" ? tabActive : tabInactive}`}
          onClick={() => setActiveTab("memo")}
        >
          Monthly Memo
        </button>
      </div>

      {/* ── Tab Panels ── */}
      <AnimatePresence mode="wait">
        {activeTab === "note" ? (
          <motion.div
            key="note-tab"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.22 }}
            className="p-6 flex flex-col gap-5 flex-1"
          >
            {/* Header */}
            <div className="flex items-center gap-2.5">
              <BookOpen
                className={`h-5 w-5 flex-shrink-0 ${isDark ? "text-blue-400" : "text-blue-600"}`}
              />
              <h2
                className={`text-2xl font-bold tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                Add Note
              </h2>
            </div>

            {/* No selection */}
            {selectionStep === 0 && (
              <div
                className={`flex-1 flex flex-col items-center justify-center gap-3 py-10 rounded-2xl border-2 border-dashed text-center ${
                  isDark ? "border-gray-700/60 text-gray-600" : "border-gray-200 text-gray-400"
                }`}
              >
                <MousePointerClick className="h-7 w-7 opacity-40" />
                <p className="text-sm leading-relaxed max-w-[160px]">
                  Select a date on the calendar to write a note
                </p>
              </div>
            )}

            {/* Awaiting range end */}
            {selectionStep === 1 && (
              <div
                className={`flex items-center justify-center py-8 rounded-2xl ${
                  isDark ? "bg-amber-900/20 text-amber-400" : "bg-amber-50 text-amber-700"
                }`}
              >
                <p className="text-sm font-semibold text-center leading-relaxed">
                  Click another date to complete the range…<br />
                  <span className="opacity-60 text-xs">or click the same date for a single day</span>
                </p>
              </div>
            )}

            {/* Form */}
            {hasSelection && (
              <>
                {/* Date badge */}
                <div
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold ${
                    isDark
                      ? "bg-blue-900/30 text-blue-300 border border-blue-800/40"
                      : "bg-blue-50 text-blue-700 border border-blue-200/60"
                  }`}
                >
                  <span>📅</span>
                  <span>{formatDateRange(startDate, endDate)}</span>
                  {isSingleDay && (
                    <span
                      className={`ml-auto text-xs font-bold uppercase tracking-wider ${
                        isDark ? "text-blue-500" : "text-blue-400"
                      }`}
                    >
                      Single Day
                    </span>
                  )}
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <label
                    className={`text-xs font-bold uppercase tracking-widest ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Title of Note
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Midnight reflections..."
                    className={`w-full px-4 py-3 rounded-xl text-base focus:outline-none transition-colors ${inputCls}`}
                  />
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <label
                    className={`text-xs font-bold uppercase tracking-widest ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Location
                  </label>
                  <div className="relative">
                    <MapPin
                      className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 ${
                        isDark ? "text-gray-500" : "text-gray-400"
                      }`}
                    />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="n/a"
                      className={`w-full pl-10 pr-4 py-3 rounded-xl text-base focus:outline-none transition-colors ${inputCls}`}
                    />
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <label
                    className={`text-xs font-bold uppercase tracking-widest ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Tag
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {TAGS.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all ${
                          selectedTag === tag
                            ? "text-gray-900 shadow-sm scale-105"
                            : isDark
                            ? "bg-gray-800/80 text-gray-400 hover:text-gray-200 border border-gray-700/50"
                            : "bg-gray-100 text-gray-500 hover:text-gray-700 border border-gray-200"
                        }`}
                        style={selectedTag === tag ? { backgroundColor: TAG_COLORS[tag] } : {}}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label
                    className={`text-xs font-bold uppercase tracking-widest ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Capture the essence of the moment…"
                    rows={3}
                    className={`w-full px-4 py-3 rounded-xl text-base resize-none focus:outline-none transition-colors ${inputCls}`}
                  />
                </div>

                {/* Save button */}
                <button
                  onClick={handleSave}
                  disabled={!title.trim()}
                  className={`w-full h-14 rounded-2xl font-bold text-base transition-all ${
                    title.trim()
                      ? "bg-gradient-to-r from-[#97a9ff] to-[#7b91ff] text-gray-900 hover:opacity-90 shadow-lg shadow-blue-900/30 active:scale-[0.98]"
                      : isDark
                      ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {justSaved ? (
                      <motion.span
                        key="saved"
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.85 }}
                        className="flex items-center justify-center gap-2"
                      >
                        <Check className="h-5 w-5" /> Saved to Events!
                      </motion.span>
                    ) : (
                      <motion.span
                        key="save"
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.85 }}
                      >
                        Save to Events
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="memo-tab"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.22 }}
            className="p-6 flex flex-col gap-5 flex-1"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileText
                  className={`h-5 w-5 flex-shrink-0 ${isDark ? "text-purple-400" : "text-purple-600"}`}
                />
                <h2
                  className={`text-2xl font-bold tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                >
                  Monthly Memo
                </h2>
              </div>
              <span
                className={`text-base font-semibold italic ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                {MONTH_NAMES[monthIndex]}
              </span>
            </div>

            {/* Month label badge */}
            <div
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold ${
                isDark
                  ? "bg-purple-900/25 text-purple-300 border border-purple-800/40"
                  : "bg-purple-50 text-purple-700 border border-purple-200/60"
              }`}
            >
              <span>📝</span>
              <span>
                {MONTH_NAMES[monthIndex]} {year} — Monthly Intentions
              </span>
            </div>

            {/* Memo textarea */}
            <div className="space-y-2 flex-1 flex flex-col">
              <label
                className={`text-sm font-bold uppercase tracking-widest ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Month-Level Notes & Intentions
              </label>
              <textarea
                value={memoText}
                onChange={(e) => setMemoText(e.target.value)}
                placeholder={`Write your intentions, goals, and reflections for ${MONTH_NAMES[monthIndex]} here…`}
                className={`flex-1 w-full px-4 py-3 rounded-xl text-base resize-none focus:outline-none transition-colors min-h-[200px] leading-relaxed ${inputCls}`}
              />
            </div>

            {/* Save memo button */}
            <button
              onClick={handleSaveMemo}
              className={`w-full h-14 rounded-2xl font-bold text-base transition-all ${
                isDark
                  ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:opacity-90 shadow-lg shadow-purple-900/30 active:scale-[0.98]"
                  : "bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:opacity-90 shadow-lg shadow-purple-500/25 active:scale-[0.98]"
              }`}
            >
              <AnimatePresence mode="wait">
                {memoSaved ? (
                  <motion.span
                    key="saved"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <Check className="h-5 w-5" /> Memo Saved!
                  </motion.span>
                ) : (
                  <motion.span
                    key="save"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                  >
                    Save Monthly Memo
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}