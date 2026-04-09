"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format, parseISO, isBefore, startOfDay } from "date-fns";
import { CalendarEvent } from "@/lib/types";
import { UpcomingEvents } from "@/components/UpcomingEvents";
import { ChevronLeft } from "lucide-react";
import { useTheme } from "@/lib/theme-context";

export default function AllEventsPage() {
  const { isDark } = useTheme();
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    const savedEvents = localStorage.getItem("calendar-events");
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  }, []);

  const handleDeleteEvent = (id: string) => {
    const updated = events.filter((e) => e.id !== id);
    setEvents(updated);
    localStorage.setItem("calendar-events", JSON.stringify(updated));
    // Also remove dot from CalendarGrid range-notes if needed
    const event = events.find((e) => e.id === id);
    if (event) {
      const rangeKey = `${event.startDate}-to-${event.endDate}`;
      const rangeNotes = JSON.parse(localStorage.getItem("calendar-range-notes") || "{}");
      if (rangeNotes[rangeKey]) {
        delete rangeNotes[rangeKey];
        localStorage.setItem("calendar-range-notes", JSON.stringify(rangeNotes));
      }
    }
  };

  const currentDate = new Date();
  
  return (
    <main className={`min-h-screen ${isDark ? 'bg-[#0c0e12] text-white' : 'bg-white text-gray-900'} p-6 sm:p-10 lg:p-16`}>
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        <Link 
          href="/" 
          className={`self-start flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
            isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Calendar
        </Link>
        
        <UpcomingEvents
          events={events}
          onDelete={handleDeleteEvent}
          monthIndex={currentDate.getMonth()}
          year={currentDate.getFullYear()}
          isFullPage={true}
        />
      </div>
    </main>
  );
}
