"use client";

import InteractiveCalendar from "@/components/Calendar";

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-[#0c0e12]">
      <InteractiveCalendar />
    </main>
  );
}