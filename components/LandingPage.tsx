"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./landing.module.css";

const MONTHS_DATA = [
  { name: "January",   idx: 0,  days: 31, startDay: 0 },
  { name: "February",  idx: 1,  days: 28, startDay: 3 },
  { name: "March",     idx: 2,  days: 31, startDay: 3 },
  { name: "April",     idx: 3,  days: 30, startDay: 6 },
  { name: "May",       idx: 4,  days: 31, startDay: 1 },
  { name: "June",      idx: 5,  days: 30, startDay: 4 },
  { name: "July",      idx: 6,  days: 31, startDay: 6 },
  { name: "August",    idx: 7,  days: 31, startDay: 2 },
  { name: "September", idx: 8,  days: 30, startDay: 5 },
  { name: "October",   idx: 9,  days: 31, startDay: 0 },
  { name: "November",  idx: 10, days: 30, startDay: 3 },
  { name: "December",  idx: 11, days: 31, startDay: 5 },
];

const SLOGAN = ["Make", "IT", "GREEN"];

function CalendarGrid({ startDay, totalDays }: { startDay: number; totalDays: number }) {
  const days = Array.from({ length: totalDays }).map((_, i) => i + 1);
  return (
    <div className={styles.calGrid}>
      <div className={styles.calHeader}>
        <span style={{ color: "#4ade80" }}>Sun</span>
        <span style={{ color: "#ddd" }}>Mon</span>
        <span style={{ color: "#ddd" }}>Tue</span>
        <span style={{ color: "#ddd" }}>Wed</span>
        <span style={{ color: "#ddd" }}>Thu</span>
        <span style={{ color: "#ddd" }}>Fri</span>
        <span style={{ color: "#4ade80" }}>Sat</span>
      </div>
      <div className={styles.calDays}>
        {Array.from({ length: startDay }).map((_, i) => (
          <span key={`e-${i}`} />
        ))}
        {days.map((d, index) => {
          const col = (startDay + index) % 7;
          const isWeekend = col === 0 || col === 6;
          return (
            <span key={d} style={{ color: isWeekend ? "#4ade80" : "#d1fae5" }}>
              {d}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [showArrows, setShowArrows] = useState(false);
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);
  const [clickingSlice, setClickingSlice] = useState<number | null>(null);

  useEffect(() => {
    setShowArrows(false);
    const t = setTimeout(() => setShowArrows(true), 2200);
    return () => clearTimeout(t);
  }, [page]);

  const currentMonths = [
    MONTHS_DATA[page * 3],
    MONTHS_DATA[page * 3 + 1],
    MONTHS_DATA[page * 3 + 2],
  ];

  const handleMonthClick = (monthIdx: number) => {
    setClickingSlice(monthIdx);
    setTimeout(() => {
      router.push(`/calendar?month=${monthIdx}`);
    }, 250);
  };

  return (
    <div className={styles.wallBackground}>
      {/* Particles */}
      <div className={styles.particles}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className={`${styles.particle} ${styles[`particle${i + 1}`]}`} />
        ))}
      </div>

      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerBadge}>WWF • 2026</div>
        <h1 className={styles.pageTitle}>Wall Calendar</h1>
        <p className={styles.pageSubtitle}>Click any month to explore it in detail</p>
      </div>

      {/* Calendar block */}
      <div className={styles.calendarBlock}>
        <img
          src="/deforested.png"
          alt="Base"
          className={`${styles.calendarImage} ${styles.baseLayer}`}
        />

        <div key={page} className={styles.forestOverlayContainer}>
          {currentMonths.map((m, idx) => (
            <div
              key={m.name}
              className={[
                styles.slice,
                hoveredSlice === m.idx ? styles.sliceHovered : "",
                clickingSlice === m.idx ? styles.sliceClicking : "",
              ].join(" ")}
              style={{
                backgroundImage: `url('/forest.png')`,
                animationDelay: `${0.2 + idx * 0.4}s`,
                backgroundPosition: `${idx * 50}% 0%`,
              }}
              onClick={() => handleMonthClick(m.idx)}
              onMouseEnter={() => setHoveredSlice(m.idx)}
              onMouseLeave={() => setHoveredSlice(null)}
              title={`Open ${m.name}`}
            >
              <div className={styles.sliceHoverOverlay} />
              <div className={styles.sliceContent}>
                <div className={styles.monthHeading}>
                  <span className={styles.bigLetter}>{m.name.charAt(0)}</span>
                  <span className={styles.smallWord}>{m.name.substring(1)}</span>
                </div>
                <div className={styles.gridWrapper}>
                  <CalendarGrid startDay={m.startDay} totalDays={m.days} />
                </div>
                <div className={`${styles.clickCta} ${hoveredSlice === m.idx ? styles.ctaVisible : ""}`}>
                  <span className={styles.ctaIcon}>→</span>
                  <span>Open {m.name}</span>
                </div>
                <div
                  className={styles.bottomSlogan}
                  style={idx === 2 ? { letterSpacing: "4px" } : {}}
                >
                  {SLOGAN[idx]}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Binding */}
        <div className={styles.bindingBar}>
          <div className={styles.wireRod} />
          {Array.from({ length: 82 }).map((_, i) => {
            if (i >= 39 && i <= 42) {
              if (i === 40) {
                return (
                  <div key={i} className={styles.hangerSection}>
                    <div className={styles.cutout} />
                    <div className={styles.wireLoop} />
                    <div className={styles.nail} />
                  </div>
                );
              }
              return <div key={i} className={styles.spacer} style={{ width: "14px" }} />;
            }
            return (
              <div key={i} className={styles.bindingUnit}>
                <div className={styles.hole} />
                <div className={styles.ring} />
              </div>
            );
          })}
        </div>

        {/* Nav arrows */}
        <div className={`${styles.navOverlay} ${showArrows ? styles.visible : ""}`}>
          <div
            className={`${styles.navArrow} ${styles.left} ${page === 0 ? styles.hidden : ""}`}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          >
            &#10094;
          </div>
          <div
            className={`${styles.navArrow} ${styles.right} ${page === 3 ? styles.hidden : ""}`}
            onClick={() => setPage((p) => Math.min(3, p + 1))}
          >
            &#10095;
          </div>
        </div>
      </div>

      {/* Page dots */}
      <div className={styles.pageDots}>
        {[0, 1, 2, 3].map((i) => (
          <button
            key={i}
            className={`${styles.dot} ${page === i ? styles.dotActive : ""}`}
            onClick={() => setPage(i)}
            title={`Q${i + 1}: ${MONTHS_DATA[i * 3].name}–${MONTHS_DATA[i * 3 + 2].name}`}
          />
        ))}
      </div>

      <div className={styles.quarterLabel}>
        Q{page + 1} • {currentMonths[0].name} – {currentMonths[2].name}
      </div>
    </div>
  );
}
