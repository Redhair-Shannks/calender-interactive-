"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { format, parseISO, isBefore, startOfDay, isSameDay } from "date-fns";
import { CalendarEvent } from "@/lib/types";
import { useTheme } from "@/lib/theme-context";
import { MapPin, Trash2, CalendarDays, Clock } from "lucide-react";

// ── Tag config ──────────────────────────────────────────────────────────────
const TAG_COLORS: Record<string, string> = {
  PERSONAL: "#97a9ff",
  WORK: "#4ade80",
  DREAM: "#f472b6",
  EVENT: "#fb923c",
  TRAVEL: "#34d399",
  REMINDER: "#facc15",
};

const TAG_BG: Record<string, string> = {
  PERSONAL: "rgba(151, 169, 255, 0.15)",
  WORK: "rgba( 74, 222, 128, 0.15)",
  DREAM: "rgba(244, 114, 182, 0.15)",
  EVENT: "rgba(251, 146,  60, 0.15)",
  TRAVEL: "rgba( 52, 211, 153, 0.15)",
  REMINDER: "rgba(250, 204,  21, 0.15)",
};

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const TEMPLATE_IMAGES = [
  "https://cdn.prod.website-files.com/69d6de927b06dfb1becbf86f/69d6de927b06dfb1becbf87c_1567035489088-image17.jpg",
  "https://cdn.prod.website-files.com/69d6de927b06dfb1becbf86f/69d6de927b06dfb1becbf87b_1567035439115-image8.jpg",
  "https://cdn.prod.website-files.com/69d6de927b06dfb1becbf86f/69d6de927b06dfb1becbf884_1567035439436-image15.jpg",
  "https://cdn.prod.website-files.com/69d6de927b06dfb1becbf86f/69d6de927b06dfb1becbf878_1567035439111-image19.jpg",
  "https://cdn.prod.website-files.com/69d6de927b06dfb1becbf86f/69d6de927b06dfb1becbf87a_1567035489081-image11.jpg",
  "https://cdn.prod.website-files.com/69d6de927b06dfb1becbf86f/69d6de927b06dfb1becbf874_1567035489085-image4.jpg",
  "https://cdn.prod.website-files.com/69d6de927b06dfb1becbf86f/69d6de927b06dfb1becbf880_1567035489086-image3.jpg",
  "https://cdn.prod.website-files.com/69d6de927b06dfb1becbf86f/69d6de927b06dfb1becbf877_1567035489084-image5.jpg",
  "https://cdn.prod.website-files.com/69d6de927b06dfb1becbf86f/69d6de927b06dfb1becbf873_1567035439110-image10.jpg",
  "https://cdn.prod.website-files.com/69d6de927b06dfb1becbf86f/69d6de927b06dfb1becbf87f_1567035489087-image13.jpg",
  "https://cdn.prod.website-files.com/69d6de927b06dfb1becbf86f/69d6de927b06dfb1becbf886_1567035439114-image7.jpg",
  "https://cdn.prod.website-files.com/69d6de927b06dfb1becbf86f/69d6de927b06dfb1becbf885_1567035439109-image1.jpg",
  "https://cdn.prod.website-files.com/69d6de927b06dfb1becbf86f/69d6de927b06dfb1becbf881_1567035439116-image16.jpg",
];

// ── Props ────────────────────────────────────────────────────────────────────
interface UpcomingEventsProps {
  events: CalendarEvent[];
  onDelete: (id: string) => void;
  monthIndex: number;
  year: number;
  isFullPage?: boolean;
}

// ── Component ────────────────────────────────────────────────────────────────
export function UpcomingEvents({ events, onDelete, monthIndex, year, isFullPage = false }: UpcomingEventsProps) {
  const { isDark } = useTheme();
  const today = startOfDay(new Date());
  
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Load monthly memo from localStorage
  const memoText =
    typeof window !== "undefined"
      ? localStorage.getItem(`monthly-memo-${year}-${monthIndex}`) ?? ""
      : "";

  // Sort chronologically — future first, past at end
  const sortedEvents = useMemo(
    () =>
      [...events].sort((a, b) => {
        const aDate = parseISO(a.startDate);
        const bDate = parseISO(b.startDate);
        const aFuture = !isBefore(aDate, today);
        const bFuture = !isBefore(bDate, today);
        if (aFuture !== bFuture) return aFuture ? -1 : 1;
        return aDate.getTime() - bDate.getTime();
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [events]
  );

  return (
    <div className="flex flex-col gap-6">
      {/* ── Monthly Memo Preview (shown only when memo exists) ── */}
      {!isFullPage && memoText && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className={`relative rounded-3xl overflow-hidden ${isDark
              ? "bg-purple-900/20 border border-purple-700/30 shadow-xl shadow-black/30"
              : "bg-purple-50/80 border border-purple-200/60 shadow-md"
            }`}
        >
          {/* Decorative quote mark */}
          <div
            className="absolute top-3 right-5 text-7xl leading-none pointer-events-none select-none"
            style={{
              fontFamily: "Georgia, serif",
              color: isDark ? "rgba(168,85,247,0.10)" : "rgba(168,85,247,0.12)",
            }}
          >
            "
          </div>

          <div className="px-6 py-5 relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">📝</span>
                <h3
                  className={`text-xl font-bold tracking-tight ${isDark ? "text-purple-200" : "text-purple-900"
                    }`}
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                >
                  {MONTH_NAMES[monthIndex]} Memo
                </h3>
              </div>
              <span
                className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${isDark
                    ? "bg-purple-800/40 text-purple-300"
                    : "bg-purple-100 text-purple-600"
                  }`}
              >
                {year}
              </span>
            </div>
            <p
              className={`text-lg leading-relaxed line-clamp-4 ${isDark ? "text-purple-100/80" : "text-purple-800"
                }`}
            >
              {memoText}
            </p>
          </div>
        </motion.div>
      )}

      {!isFullPage ? (
        <div className="flex flex-col gap-4 mt-2">
           <Link href="/all-events" className="w-full">
              <button 
                className={`w-full py-4 text-center rounded-2xl font-bold tracking-widest text-sm transition-colors shadow-sm ${
                  isDark 
                    ? "bg-[#2f2f2c] text-white hover:bg-[#1a1a18]" 
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                VIEW ALL EVENTS {sortedEvents.length > 0 && `(${sortedEvents.length})`}
              </button>
           </Link>
        </div>
      ) : (
        <>
          {/* ── Section header (Redesigned) ── */}
      <div className="flex flex-col">
        <h1
          className={`text-4xl font-bold font-mono tracking-tight leading-tight ${isDark ? "text-white" : "text-gray-900"
            }`}
        >
          Your Events
        </h1>
      </div>

      {/* ── Empty state ── */}
      {sortedEvents.length === 0 && (
        <div
          className={`flex flex-col items-center justify-center gap-4 py-16 rounded-3xl border-2 border-dashed ${isDark
              ? "border-gray-800 text-gray-600"
              : "border-gray-200 text-gray-400"
            }`}
        >
          <CalendarDays className="h-10 w-10 opacity-30" />
          <p className="text-base text-center leading-relaxed">
            No events yet.
            <br />
            <span className="text-sm opacity-70">
              Select a date range and add your first note.
            </span>
          </p>
        </div>
      )}

      {/* ── Event cards grid (New webflow style) ── */}
      <AnimatePresence mode="popLayout">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedEvents.map((event, i) => {
            const startDate = parseISO(event.startDate);
            const isPast = isBefore(parseISO(event.endDate), today);
            
            const isExpanded = expandedId === event.id;

            return (
              <motion.div
                key={event.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className={`flex flex-col overflow-hidden rounded-xl group relative ${isDark
                    ? "bg-[#1e1e24] text-gray-200 hover:bg-[#25252d]"
                    : "bg-[#f8f8fb] text-gray-800 hover:bg-[#f2f2f7]"
                  } transition-colors ${isPast ? "opacity-60" : ""}`}
              >
                {/* Delete button (hover reveal) */}
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(event.id); }}
                  className={`absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-all w-8 h-8 flex items-center justify-center rounded-full shadow-sm ${isDark
                      ? "text-gray-400 hover:text-red-400 bg-gray-800 hover:bg-gray-700"
                      : "text-gray-500 hover:text-red-500 bg-white hover:bg-gray-100"
                    }`}
                  aria-label="Delete event"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                {/* Top Section */}
                <div className="p-6 flex flex-row shrink-0">
                  {/* Left Date block */}
                  <div className={`flex flex-col w-16 items-center justify-start pr-6 border-r border-opacity-40 ${isDark ? "border-gray-600 text-gray-300" : "border-gray-300 text-gray-600"}`}>
                    <span className="font-mono text-sm tracking-widest font-semibold uppercase">{format(startDate, "EEE")}</span>
                    <span className="font-mono text-3xl font-light leading-none mt-2">{format(startDate, "d")}</span>
                  </div>

                  {/* Right Info block */}
                  <div className="pl-6 flex flex-col justify-center flex-1">
                    <h2 className={`text-xl font-mono ${isDark ? "text-gray-100" : "text-gray-800"}`}>
                      {event.title}
                    </h2>
                    <div className={`flex flex-col gap-1.5 mt-2.5 text-sm font-mono ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 opacity-70" />
                        <span>{format(startDate, "MMMM d, yyyy")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 opacity-70" />
                        <span className="truncate">{event.location || "n/a"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Image Section */}
                <div className="w-full flex-shrink-0">
                  <img 
                    src={TEMPLATE_IMAGES[i % TEMPLATE_IMAGES.length]} 
                    alt="Event Placeholder" 
                    className="w-full h-48 sm:h-56 object-cover" 
                  />
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-5">
                        <h3 className="font-mono font-bold text-2xl mb-3">
                          {event.title}
                        </h3>
                        <p className={`font-mono text-base leading-relaxed whitespace-pre-wrap ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                          {event.description}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Bottom Buttons */}
                <div className={`flex flex-row mt-auto px-[2px] pb-[2px] mx-[2px] mb-[2px] gap-[2px] ${isExpanded ? "pt-[2px]" : "pt-0"}`}>
                  <button 
                    className="flex-1 py-3 text-center bg-[#2f2f2c] hover:bg-[#1a1a18] text-gray-200 text-sm font-mono font-semibold transition-colors rounded-bl-lg"
                    onClick={(e) => { e.stopPropagation(); }}
                  >
                    RSVP
                  </button>
                  <button 
                    className="flex-1 py-3 text-center bg-[#2f2f2c] hover:bg-[#1a1a18] text-gray-200 text-sm font-mono font-semibold transition-colors rounded-br-lg"
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      setExpandedId(isExpanded ? null : event.id); 
                    }}
                  >
                    {isExpanded ? "Show Less" : "Learn More"}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </AnimatePresence>
        </>
      )}
    </div>
  );
}
