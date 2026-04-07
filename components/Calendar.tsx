"use client";

import { useState, useEffect } from "react";
import { format, addMonths, subMonths, isSameDay } from "date-fns";
import { HeroImage } from "./HeroImage";
import { CalendarGrid } from "./CalendarGrid";
import { NotesPanel } from "./NotesPanel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { formatDateRange } from "@/lib/calendar-utils";

// Default monthly hero images
const defaultMonthImages: Record<number, string> = {
  0: "https://picsum.photos/id/1016/1200/800",  // Jan
  1: "https://picsum.photos/id/1005/1200/800",  // Feb
  2: "https://picsum.photos/id/133/1200/800",   // Mar
  3: "https://picsum.photos/id/201/1200/800",   // Apr
  4: "https://picsum.photos/id/1009/1200/800",  // May
  5: "https://picsum.photos/id/1016/1200/800",  // Jun
  6: "https://picsum.photos/id/251/1200/800",   // Jul
  7: "https://picsum.photos/id/29/1200/800",    // Aug
  8: "https://picsum.photos/id/30/1200/800",    // Sep
  9: "https://picsum.photos/id/1018/1200/800",  // Oct
  10: "https://picsum.photos/id/870/1200/800",  // Nov
  11: "https://picsum.photos/id/1015/1200/800", // Dec
};

export default function InteractiveCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [customImages, setCustomImages] = useState<Record<number, string>>({});

  // Load custom images from localStorage
  useEffect(() => {
    const loaded: Record<number, string> = {};
    for (let i = 0; i < 12; i++) {
      const saved = localStorage.getItem(`hero-image-${i}`);
      if (saved) loaded[i] = saved;
    }
    setCustomImages(loaded);
  }, []);

  const monthIndex = currentMonth.getMonth();
  const currentImage = customImages[monthIndex] || defaultMonthImages[monthIndex];

  const handleDateClick = (day: Date) => {
    if (!startDate) {
      setStartDate(day);
      setEndDate(day);
    } else if (startDate && endDate && isSameDay(startDate, endDate)) {
      if (isSameDay(day, startDate)) {
        setStartDate(null);
        setEndDate(null);
      } else {
        if (day < startDate) {
          setEndDate(startDate);
          setStartDate(day);
        } else {
          setEndDate(day);
        }
      }
    } else {
      setStartDate(day);
      setEndDate(day);
    }
  };

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const clearSelection = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const handleCustomImageUpload = (monthIdx: number, dataUrl: string) => {
    setCustomImages((prev) => ({ ...prev, [monthIdx]: dataUrl }));
    localStorage.setItem(`hero-image-${monthIdx}`, dataUrl);
  };

  const handleResetImage = (monthIdx: number) => {
    setCustomImages((prev) => {
      const newImages = { ...prev };
      delete newImages[monthIdx];
      return newImages;
    });
    localStorage.removeItem(`hero-image-${monthIdx}`);
  };

  const pageVariants = {
    enter: { opacity: 0, x: 60, rotateY: 15 },
    center: { opacity: 1, x: 0, rotateY: 0 },
    exit: { opacity: 0, x: -60, rotateY: -15 },
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <Card className="overflow-hidden border-0 shadow-2xl rounded-3xl bg-white">
        <HeroImage
          currentMonth={currentMonth}
          imageUrl={currentImage}
          monthIndex={monthIndex}
          onUpload={handleCustomImageUpload}
          onReset={handleResetImage}
        />

        <div className="flex items-center justify-between px-8 py-5 bg-white border-b">
          <Button variant="ghost" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-2xl font-semibold text-gray-800">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
          <Button variant="ghost" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <div className="grid lg:grid-cols-12">
          <div className="lg:col-span-4 p-6 lg:border-r border-gray-100">
            <NotesPanel startDate={startDate} endDate={endDate} monthIndex={monthIndex} />
          </div>

          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentMonth.toISOString()}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <CalendarGrid
                  currentMonth={currentMonth}
                  startDate={startDate}
                  endDate={endDate}
                  onDateClick={handleDateClick}
                />
              </motion.div>
            </AnimatePresence>

            {startDate && (
              <div className="px-8 pb-8 flex items-center justify-between">
                <div className="text-sm font-medium text-blue-600 bg-blue-50 px-5 py-2 rounded-3xl">
                  {formatDateRange(startDate, endDate)}
                </div>
                <Button variant="ghost" onClick={clearSelection} className="text-gray-400 hover:text-red-500">
                  Clear selection
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}