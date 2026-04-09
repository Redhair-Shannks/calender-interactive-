"use client";

import { Suspense } from "react";
import InteractiveCalendar from "@/components/Calendar";

export default function CalendarPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-[#0c0e12]">
      <Suspense fallback={<div className="min-h-screen bg-[#0c0e12]" />}>
        <InteractiveCalendar />
      </Suspense>
    </main>
  );
}
