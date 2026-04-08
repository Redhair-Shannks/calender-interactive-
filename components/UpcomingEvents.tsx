"use client";
import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, parseISO, isBefore, startOfDay, isSameDay } from "date-fns";
import { CalendarEvent } from "@/lib/types";
import { useTheme } from "@/lib/theme-context";
import { MapPin, Trash2, CalendarDays, Clock } from "lucide-react";

// ── Tag config ──────────────────────────────────────────────────────────────
const TAG_COLORS: Record<string, string> = {
  PERSONAL: "#97a9ff",
  WORK:     "#4ade80",
  DREAM:    "#f472b6",
  EVENT:    "#fb923c",
  TRAVEL:   "#34d399",
  REMINDER: "#facc15",
};

const TAG_BG: Record<string, string> = {
  PERSONAL: "rgba(151, 169, 255, 0.15)",
  WORK:     "rgba( 74, 222, 128, 0.15)",
  DREAM:    "rgba(244, 114, 182, 0.15)",
  EVENT:    "rgba(251, 146,  60, 0.15)",
  TRAVEL:   "rgba( 52, 211, 153, 0.15)",
  REMINDER: "rgba(250, 204,  21, 0.15)",
};

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

// ── Props ────────────────────────────────────────────────────────────────────
interface UpcomingEventsProps {
  events:     CalendarEvent[];
  onDelete:   (id: string) => void;
  monthIndex: number;
  year:       number;
}

// ── Component ────────────────────────────────────────────────────────────────
export function UpcomingEvents({ events, onDelete, monthIndex, year }: UpcomingEventsProps) {
  const { isDark } = useTheme();
  const today = startOfDay(new Date());

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
      {memoText && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className={`relative rounded-3xl overflow-hidden ${
            isDark
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
                  className={`text-xl font-bold tracking-tight ${
                    isDark ? "text-purple-200" : "text-purple-900"
                  }`}
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                >
                  {MONTH_NAMES[monthIndex]} Memo
                </h3>
              </div>
              <span
                className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                  isDark
                    ? "bg-purple-800/40 text-purple-300"
                    : "bg-purple-100 text-purple-600"
                }`}
              >
                {year}
              </span>
            </div>
            <p
              className={`text-base leading-relaxed line-clamp-4 ${
                isDark ? "text-purple-100/80" : "text-purple-800"
              }`}
            >
              {memoText}
            </p>
          </div>
        </motion.div>
      )}

      {/* ── Section header ── */}
      <div className="flex items-end justify-between">
        <div>
          <p
            className={`text-xs font-bold uppercase tracking-widest ${
              isDark ? "text-gray-500" : "text-gray-400"
            }`}
          >
            Curation
          </p>
          <h2
            className={`text-3xl font-bold tracking-tight leading-tight mt-0.5 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Upcoming Events
          </h2>
        </div>
        {events.length > 0 && (
          <span
            className={`text-sm font-semibold pb-1 ${
              isDark ? "text-gray-500" : "text-gray-400"
            }`}
          >
            {events.length} {events.length === 1 ? "entry" : "entries"}
          </span>
        )}
      </div>

      {/* ── Empty state ── */}
      {sortedEvents.length === 0 && (
        <div
          className={`flex flex-col items-center justify-center gap-4 py-16 rounded-3xl border-2 border-dashed ${
            isDark
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

      {/* ── Event cards grid ── */}
      <AnimatePresence mode="popLayout">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {sortedEvents.map((event, i) => {
            const startDate = parseISO(event.startDate);
            const endDate   = parseISO(event.endDate);
            const isPast    = isBefore(endDate, today);
            const isSingle  = isSameDay(startDate, endDate);

            const tagColor = TAG_COLORS[event.tag] || "#97a9ff";
            const tagBg    = TAG_BG[event.tag]    || "rgba(151,169,255,0.15)";

            const dateLabel = isSingle
              ? format(startDate, "MMM d").toUpperCase()
              : `${format(startDate, "MMM d").toUpperCase()} – ${format(endDate, "d")}`;

            return (
              <motion.div
                key={event.id}
                layout
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0,  scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.28, delay: i * 0.05 }}
                className={`relative rounded-2xl overflow-hidden group transition-colors ${
                  isDark
                    ? "bg-gray-900/70 border border-white/5 hover:border-white/12 shadow-xl shadow-black/30"
                    : "bg-white border border-gray-100 hover:border-gray-200 shadow-sm"
                } ${isPast ? "opacity-60" : ""}`}
              >
                {/* Tag color accent bar (left edge) */}
                <div
                  className="absolute left-0 inset-y-0 w-1 rounded-l-2xl"
                  style={{ backgroundColor: tagColor }}
                />

                <div className="pl-6 pr-5 py-5 flex flex-col gap-3">
                  {/* Top row: date pill + tag chip + past badge */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-black text-gray-900"
                      style={{ backgroundColor: tagColor }}
                    >
                      {dateLabel}
                    </span>
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold"
                      style={{ backgroundColor: tagBg, color: tagColor }}
                    >
                      {event.tag}
                    </span>
                    {isPast && (
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${
                          isDark
                            ? "bg-gray-800 text-gray-500"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        Past
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3
                    className={`font-bold text-lg leading-snug ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                    style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                  >
                    {event.title}
                  </h3>

                  {/* Location */}
                  {event.location && event.location !== "n/a" && (
                    <div
                      className={`flex items-center gap-2 text-sm ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  )}

                  {/* Description snippet */}
                  {event.description && (
                    <p
                      className={`text-sm leading-relaxed line-clamp-2 ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {event.description}
                    </p>
                  )}

                  {/* Created at */}
                  <div
                    className={`flex items-center gap-1.5 text-xs mt-0.5 ${
                      isDark ? "text-gray-600" : "text-gray-300"
                    }`}
                  >
                    <Clock className="h-3 w-3" />
                    <span>Added {format(new Date(event.createdAt), "MMM d, yyyy")}</span>
                  </div>
                </div>

                {/* Delete button (hover reveal) */}
                <button
                  onClick={() => onDelete(event.id)}
                  className={`absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all w-8 h-8 flex items-center justify-center rounded-full ${
                    isDark
                      ? "text-gray-500 hover:text-red-400 hover:bg-red-900/30"
                      : "text-gray-300 hover:text-red-500 hover:bg-red-50"
                  }`}
                  aria-label="Delete event"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </motion.div>
            );
          })}
        </div>
      </AnimatePresence>
    </div>
  );
}
