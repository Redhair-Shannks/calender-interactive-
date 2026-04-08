"use client";
import { useState, useEffect } from "react";
import { formatDateRange } from "@/lib/calendar-utils";
import { Check, Save, BookOpen, CalendarDays, MousePointerClick } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/lib/theme-context";
import { format, isSameDay } from "date-fns";

interface NotesPanelProps {
  startDate: Date | null;
  endDate: Date | null;
  monthIndex: number;
  year: number;
  onNotesSaved?: () => void;
  selectionStep: 0 | 1 | 2;
}

export function NotesPanel({
  startDate,
  endDate,
  monthIndex,
  year,
  onNotesSaved,
  selectionStep,
}: NotesPanelProps) {
  const { isDark } = useTheme();
  const [generalNotes, setGeneralNotes] = useState("");
  const [rangeNotes, setRangeNotes] = useState<Record<string, string>>({});
  const [justSaved, setJustSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"month" | "range">("month");

  const rangeKey =
    startDate && endDate
      ? `${format(startDate, "yyyy-MM-dd")}-to-${format(endDate, "yyyy-MM-dd")}`
      : null;

  // Auto-switch to range tab when selection is complete
  useEffect(() => {
    if (selectionStep === 2 && rangeKey) {
      setActiveTab("range");
    }
  }, [selectionStep, rangeKey]);

  useEffect(() => {
    const savedGeneral = localStorage.getItem(`calendar-general-notes-${year}-${monthIndex}`);
    setGeneralNotes(savedGeneral || "");
    const savedRange = localStorage.getItem("calendar-range-notes");
    if (savedRange) setRangeNotes(JSON.parse(savedRange));
  }, [monthIndex, year, startDate, endDate]);

  const handleSave = () => {
    localStorage.setItem(`calendar-general-notes-${year}-${monthIndex}`, generalNotes);
    if (rangeKey) {
      const updated = { ...rangeNotes };
      const val = rangeNotes[rangeKey] || "";
      if (val.trim() === "") {
        delete updated[rangeKey];
      } else {
        updated[rangeKey] = val;
      }
      setRangeNotes(updated);
      localStorage.setItem("calendar-range-notes", JSON.stringify(updated));
    }
    setJustSaved(true);
    onNotesSaved?.();
    setTimeout(() => setJustSaved(false), 2000);
  };

  const hasRange = !!rangeKey && selectionStep === 2;
  const rangeNoteValue = rangeKey ? rangeNotes[rangeKey] || "" : "";
  const isSingleDay = !!startDate && !!endDate && isSameDay(startDate, endDate);

  return (
    <div className={`flex flex-col gap-3 p-4 sm:p-5 ${isDark ? "text-gray-100" : "text-gray-800"}`}>
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, -8, 8, 0] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
          >
            <BookOpen className={`h-4 w-4 flex-shrink-0 ${isDark ? "text-amber-400" : "text-amber-600"}`} />
          </motion.div>
          <h2 className={`text-base font-black tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}>
            Notes
          </h2>
        </div>

        {/* Tab switcher */}
        <div className={`flex rounded-xl p-0.5 text-[11px] font-bold ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
          <button
            onClick={() => setActiveTab("month")}
            className={`flex items-center justify-center gap-1 px-3 py-1.5 rounded-[9px] transition-all ${
              activeTab === "month"
                ? isDark
                  ? "bg-gray-700 text-white shadow"
                  : "bg-white text-gray-900 shadow"
                : isDark
                ? "text-gray-500"
                : "text-gray-400"
            }`}
          >
            <CalendarDays className="h-3 w-3" />
            Monthly
          </button>
          <button
            onClick={() => hasRange && setActiveTab("range")}
            className={`flex items-center justify-center gap-1 px-3 py-1.5 rounded-[9px] transition-all relative ${
              activeTab === "range"
                ? isDark
                  ? "bg-gray-700 text-white shadow"
                  : "bg-white text-gray-900 shadow"
                : !hasRange
                ? isDark
                  ? "text-gray-700 cursor-default"
                  : "text-gray-300 cursor-default"
                : isDark
                ? "text-gray-500"
                : "text-gray-400"
            }`}
          >
            <MousePointerClick className="h-3 w-3" />
            {isSingleDay ? "Day" : "Range"}
            {hasRange && rangeNoteValue.trim() && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-blue-500" />
            )}
          </button>
        </div>
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {activeTab === "month" ? (
          <motion.div
            key="month"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.18 }}
            className="flex flex-col gap-1.5"
          >
            <label className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? "text-gray-500" : "text-gray-400"}`}>
              {format(new Date(year, monthIndex), "MMMM yyyy")} memo
            </label>
            <textarea
              value={generalNotes}
              onChange={(e) => setGeneralNotes(e.target.value)}
              placeholder={`Jot down anything for ${format(new Date(year, monthIndex), "MMMM")}…`}
              rows={3}
              className={`w-full rounded-xl px-3 py-2.5 text-sm resize-none leading-relaxed border focus:outline-none transition-colors ${
                isDark
                  ? "bg-gray-800/60 border-gray-700 text-gray-100 placeholder:text-gray-600 focus:bg-gray-800 focus:border-gray-600"
                  : "bg-amber-50/70 border-amber-200/80 text-gray-700 placeholder:text-gray-400 focus:bg-amber-50 focus:border-amber-300"
              }`}
            />
            <p className={`text-[10px] text-right ${isDark ? "text-gray-600" : "text-gray-400"}`}>
              {generalNotes.length} chars
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="range"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.18 }}
            className="flex flex-col gap-1.5"
          >
            {hasRange ? (
              <>
                <div className="flex items-center justify-between">
                  <label className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                    {isSingleDay ? "Selected date" : "Selected range"}
                  </label>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    isDark ? "bg-blue-900/50 text-blue-400" : "bg-blue-100 text-blue-600"
                  }`}>
                    {formatDateRange(startDate, endDate)}
                  </span>
                </div>
                <textarea
                  value={rangeNoteValue}
                  onChange={(e) =>
                    setRangeNotes((prev) => ({ ...prev, [rangeKey!]: e.target.value }))
                  }
                  placeholder={
                    isSingleDay
                      ? "Write a note for this date…"
                      : "Write a note for this date range…"
                  }
                  rows={3}
                  className={`w-full rounded-xl px-3 py-2.5 text-sm resize-none leading-relaxed border focus:outline-none transition-colors ${
                    isDark
                      ? "bg-blue-950/40 border-blue-800/60 text-gray-100 placeholder:text-gray-600 focus:bg-blue-950/60 focus:border-blue-700"
                      : "bg-blue-50/70 border-blue-200/80 text-gray-700 placeholder:text-gray-400 focus:bg-blue-50 focus:border-blue-300"
                  }`}
                />
                <p className={`text-[10px] text-right ${isDark ? "text-gray-600" : "text-gray-400"}`}>
                  {rangeNoteValue.length} chars
                </p>
              </>
            ) : (
              <div className={`flex flex-col items-center justify-center gap-2 py-6 rounded-xl border-2 border-dashed ${
                isDark ? "border-gray-700 text-gray-600" : "border-gray-200 text-gray-400"
              }`}>
                <MousePointerClick className="h-6 w-6 opacity-40" />
                <p className="text-xs text-center leading-relaxed max-w-[160px]">
                  Select a date or range on the calendar to add a note
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Save button */}
      <button
        onClick={handleSave}
        className={`w-full font-bold text-sm h-10 rounded-xl shadow-sm transition-all text-white ${
          isDark
            ? "bg-blue-700 hover:bg-blue-600"
            : "bg-blue-600 hover:bg-blue-700"
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
              <Check className="h-4 w-4" />
              Saved!
            </motion.span>
          ) : (
            <motion.span
              key="save"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              className="flex items-center justify-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Notes
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}