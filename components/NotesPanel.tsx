"use client";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
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

  // Auto-switch to range tab when selection is complete (works for both range + single day)
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
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45 }}
      className="flex flex-col h-full gap-4 sm:gap-5"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <motion.div
          animate={{ rotate: [0, -8, 8, 0] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
        >
          <BookOpen
            className={`h-5 w-5 flex-shrink-0 ${isDark ? "text-amber-400" : "text-amber-600"}`}
          />
        </motion.div>
        <h2
          className={`text-lg sm:text-xl font-black tracking-tight ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          Notes
        </h2>
      </div>

      {/* Tab switcher */}
      <div
        className={`flex rounded-xl p-0.5 text-xs font-bold ${
          isDark ? "bg-gray-800" : "bg-gray-100"
        }`}
      >
        <button
          onClick={() => setActiveTab("month")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-[10px] transition-all ${
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
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-[10px] transition-all relative ${
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
          {isSingleDay ? "Single Day" : "Range"}
          {hasRange && rangeNoteValue.trim() && (
            <span
              className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${
                isDark ? "bg-blue-500" : "bg-blue-500"
              }`}
            />
          )}
        </button>
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {activeTab === "month" ? (
          <motion.div
            key="month"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col"
          >
            <label
              className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-2 ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            >
              {format(new Date(year, monthIndex), "MMMM yyyy")} memo
            </label>
            <Textarea
              value={generalNotes}
              onChange={(e) => setGeneralNotes(e.target.value)}
              placeholder={`Jot down anything for ${format(new Date(year, monthIndex), "MMMM")}…`}
              className={`flex-1 min-h-[140px] sm:min-h-[180px] rounded-2xl text-sm resize-none leading-relaxed ${
                isDark
                  ? "bg-gray-800/60 border-gray-700 text-gray-100 placeholder:text-gray-600 focus:bg-gray-800"
                  : "bg-amber-50/60 border-amber-200/80 text-gray-700 placeholder:text-gray-400 focus:bg-amber-50"
              }`}
            />
            <p
              className={`text-[10px] mt-1.5 text-right ${
                isDark ? "text-gray-600" : "text-gray-400"
              }`}
            >
              {generalNotes.length} chars
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="range"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col"
          >
            {hasRange ? (
              <>
                <div className="flex items-center justify-between mb-2">
                  <label
                    className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    {isSingleDay ? "Selected date" : "Selected range"}
                  </label>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      isDark
                        ? "bg-blue-900/50 text-blue-400"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {formatDateRange(startDate, endDate)}
                  </span>
                </div>
                <Textarea
                  value={rangeNoteValue}
                  onChange={(e) =>
                    setRangeNotes((prev) => ({ ...prev, [rangeKey!]: e.target.value }))
                  }
                  placeholder={
                    isSingleDay
                      ? "Write a note for this single date…"
                      : "Write a note for this date range…"
                  }
                  className={`flex-1 min-h-[140px] sm:min-h-[180px] rounded-2xl text-sm resize-none leading-relaxed ${
                    isDark
                      ? "bg-blue-950/40 border-blue-800/60 text-gray-100 placeholder:text-gray-600 focus:bg-blue-950/60"
                      : "bg-blue-50/60 border-blue-200/80 text-gray-700 placeholder:text-gray-400 focus:bg-blue-50"
                  }`}
                />
                <p
                  className={`text-[10px] mt-1.5 text-right ${
                    isDark ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  {rangeNoteValue.length} chars
                </p>
              </>
            ) : (
              <div
                className={`flex-1 min-h-[160px] flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed ${
                  isDark
                    ? "border-gray-700 text-gray-600"
                    : "border-gray-200 text-gray-400"
                }`}
              >
                <MousePointerClick className="h-7 w-7 opacity-40" />
                <p className="text-xs text-center leading-relaxed max-w-[160px]">
                  Select a date (or range) on the calendar to add a note
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Save button */}
      <Button
        onClick={handleSave}
        className={`w-full font-bold text-sm h-11 rounded-2xl shadow-md transition-all text-white ${
          isDark
            ? "bg-blue-700 hover:bg-blue-600 shadow-blue-900/30"
            : "bg-blue-600 hover:bg-blue-700 shadow-blue-200/60"
        }`}
      >
        <AnimatePresence mode="wait">
          {justSaved ? (
            <motion.span
              key="saved"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              className="flex items-center gap-2"
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
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Notes
            </motion.span>
          )}
        </AnimatePresence>
      </Button>
    </motion.div>
  );
}