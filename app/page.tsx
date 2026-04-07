import InteractiveCalendar from "@/components/Calendar";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-blue-50">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl" />
      </div>
      
      <div className="relative z-10">
        <InteractiveCalendar />
      </div>
    </main>
  );
}
