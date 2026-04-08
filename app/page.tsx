"use client";

import InteractiveCalendar from "@/components/Calendar";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f0ede8] dark:bg-gray-950 flex items-center justify-center">
      <InteractiveCalendar />
    </main>
  );
}