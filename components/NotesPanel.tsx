"use client";

import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDateRange } from "@/lib/calendar-utils";
import { Check, Save, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/lib/theme-context";
import { format } from "date-fns";

interface NotesPanelProps {
  startDate: Date | null;
  endDate: Date | null;
  monthIndex: number;
  year: number;                    // ← NEW: required for year-aware notes
  onNotesSaved?: () => void;
}

export function NotesPanel({ startDate, endDate, monthIndex, year, onNotesSaved }: NotesPanelProps) {
  const { isDark } = useTheme();
  const [generalNotes, setGeneralNotes] = useState("");
  const [rangeNotes, setRangeNotes] = useState<Record<string, string>>({});
  const [justSaved, setJustSaved] = useState(false);

  const rangeKey = startDate && endDate
    ? `${format(startDate, 'yyyy-MM-dd')}-to-${format(endDate, 'yyyy-MM-dd')}`
    : null;

  useEffect(() => {
    // ✅ Year-aware general notes
    const savedGeneral = localStorage.getItem(`calendar-general-notes-${year}-${monthIndex}`);
    setGeneralNotes(savedGeneral || "");

    const savedRange = localStorage.getItem("calendar-range-notes");
    if (savedRange) setRangeNotes(JSON.parse(savedRange));
  }, [monthIndex, year, startDate, endDate]);

  const handleSave = () => {
    // ✅ Save with year
    localStorage.setItem(`calendar-general-notes-${year}-${monthIndex}`, generalNotes);

    if (rangeKey) {
      const updated = { ...rangeNotes };
      const newValue = rangeNotes[rangeKey] || "";

      if (newValue.trim() === "") {
        delete updated[rangeKey];
      } else {
        updated[rangeKey] = newValue;
      }

      setRangeNotes(updated);
      localStorage.setItem("calendar-range-notes", JSON.stringify(updated));
    }

    setJustSaved(true);
    onNotesSaved?.();
    setTimeout(() => setJustSaved(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={`h-full border-0 shadow-none rounded-2xl sm:rounded-3xl ${isDark ? 'bg-gradient-to-br from-gray-800/50 to-gray-800/30' : 'bg-gradient-to-br from-amber-50/50 to-orange-50/30'}`}>
        <CardHeader className="pb-3 sm:pb-5">
          <CardTitle className={`flex items-center gap-2 text-xl sm:text-2xl font-bold flex-wrap ${isDark ? 'text-gray-50' : 'text-gray-900'}`}>
            <motion.div animate={{ rotate: [0, -5, 5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <BookOpen className={`h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
            </motion.div>
            Notes
            <AnimatePresence>
              {rangeKey && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className={`text-xs px-3 py-1 rounded-full font-semibold ml-auto ${isDark ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white' : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'}`}
                >
                  {formatDateRange(startDate, endDate)}
                </motion.span>
              )}
            </AnimatePresence>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <label className={`text-[11px] sm:text-xs font-bold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Monthly Memos
              </label>
              <span className={`text-[9px] sm:text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                {generalNotes.length} chars
              </span>
            </div>
            <Textarea
              value={generalNotes}
              onChange={(e) => setGeneralNotes(e.target.value)}
              placeholder="Jot down anything for this month..."
              className={`min-h-28 sm:min-h-36 rounded-xl sm:rounded-2xl text-sm sm:text-base resize-none ${isDark ? 'bg-gray-700/50 border-gray-600 text-gray-100 placeholder:text-gray-400 focus:bg-gray-700' : 'bg-white/70 border-amber-200 text-gray-700 placeholder:text-gray-400 focus:bg-white'}`}
            />
          </motion.div>

          <AnimatePresence>
            {rangeKey && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ delay: 0.2 }}>
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <label className={`text-[11px] sm:text-xs font-bold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Range Notes
                  </label>
                  <span className={`text-[9px] sm:text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {(rangeNotes[rangeKey] || "").length} chars
                  </span>
                </div>
                <Textarea
                  value={rangeNotes[rangeKey] || ""}
                  onChange={(e) => setRangeNotes(prev => ({ ...prev, [rangeKey]: e.target.value }))}
                  placeholder="Specific note for this date range..."
                  className={`min-h-24 sm:min-h-32 rounded-xl sm:rounded-2xl text-sm sm:text-base resize-none ${isDark ? 'bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border-blue-700 text-gray-100 placeholder:text-gray-400 focus:bg-blue-900/50' : 'bg-gradient-to-br from-blue-50/70 to-cyan-50/70 border-blue-200 text-gray-700 placeholder:text-gray-400 focus:bg-blue-50/50'}`}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Button
              onClick={handleSave}
              className={`w-full font-semibold text-sm sm:text-base h-10 sm:h-12 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all text-white ${isDark ? 'bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-600 hover:to-blue-700' : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'}`}
            >
              <AnimatePresence mode="wait">
                {justSaved ? (
                  <motion.div key="saved" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="flex items-center gap-2">
                    <Check className="h-5 w-5" />
                    Saved!
                  </motion.div>
                ) : (
                  <motion.div key="save" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="flex items-center gap-2">
                    <Save className="h-5 w-5" />
                    Save Notes
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}