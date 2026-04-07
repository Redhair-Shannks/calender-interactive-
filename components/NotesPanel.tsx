"use client";

import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDateRange } from "@/lib/calendar-utils";
import { Check } from "lucide-react";

interface NotesPanelProps {
  startDate: Date | null;
  endDate: Date | null;
  monthIndex: number;
}

export function NotesPanel({ startDate, endDate, monthIndex }: NotesPanelProps) {
  const [generalNotes, setGeneralNotes] = useState("");
  const [rangeNotes, setRangeNotes] = useState<Record<string, string>>({});
  const [justSaved, setJustSaved] = useState(false);

  const rangeKey = startDate && endDate ? `${startDate.toDateString()}-${endDate.toDateString()}` : null;

  // Load notes when month or selection changes
  useEffect(() => {
    // General notes — unique per month
    const savedGeneral = localStorage.getItem(`calendar-general-notes-${monthIndex}`);
    setGeneralNotes(savedGeneral || "");

    // Range notes (shared)
    const savedRange = localStorage.getItem("calendar-range-notes");
    if (savedRange) setRangeNotes(JSON.parse(savedRange));
  }, [monthIndex, startDate, endDate]);   // ← This array must stay exactly like this

  const handleSave = () => {
    localStorage.setItem(`calendar-general-notes-${monthIndex}`, generalNotes);

    if (rangeKey) {
      const updated = { ...rangeNotes, [rangeKey]: rangeNotes[rangeKey] || "" };
      setRangeNotes(updated);
      localStorage.setItem("calendar-range-notes", JSON.stringify(updated));
    }

    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1800);
  };

  return (
    <Card className="h-full border-0 shadow-none bg-[#f8f1e3] rounded-3xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          📝 Notes
          {rangeKey && (
            <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-3xl font-normal">
              {formatDateRange(startDate, endDate)}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="text-xs text-gray-500 mb-2">General memos for the month</p>
          <Textarea
            value={generalNotes}
            onChange={(e) => setGeneralNotes(e.target.value)}
            placeholder="Jot down anything for this month..."
            className="min-h-32 bg-white border-amber-200"
          />
        </div>

        {rangeKey && (
          <div>
            <p className="text-xs text-gray-500 mb-2">Note for selected range</p>
            <Textarea
              value={rangeNotes[rangeKey] || ""}
              onChange={(e) => setRangeNotes(prev => ({ ...prev, [rangeKey]: e.target.value }))}
              placeholder="Specific note for this date range..."
              className="min-h-28 bg-white border-blue-200"
            />
          </div>
        )}

        <Button onClick={handleSave} className="w-full" size="lg">
          {justSaved ? (
            <>
              <Check className="mr-2 h-4 w-4" /> Saved!
            </>
          ) : (
            "💾 Save Notes"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}