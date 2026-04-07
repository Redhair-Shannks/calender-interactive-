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
    <div className="w-full px-3 sm:px-4 py-8 sm:py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto"
      >
        <Card className="overflow-hidden border-0 shadow-2xl rounded-2xl sm:rounded-3xl bg-white backdrop-blur-xl">
          <HeroImage
            currentMonth={currentMonth}
            imageUrl={currentImage}
            monthIndex={monthIndex}
            onUpload={handleCustomImageUpload}
            onReset={handleResetImage}
          />

          <div className="flex items-center justify-between px-4 sm:px-8 py-5 sm:py-7 bg-gradient-to-r from-white to-blue-50/30 border-b border-gray-100">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={prevMonth}
                className="text-gray-600 hover:text-blue-600 transition-colors h-9 w-9 sm:h-10 sm:w-10"
              >
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </motion.div>
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                {format(currentMonth, "MMMM")}
              </h2>
              <p className="text-[10px] sm:text-xs text-gray-500 text-center tracking-widest mt-1">
                {format(currentMonth, "yyyy")}
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={nextMonth}
                className="text-gray-600 hover:text-blue-600 transition-colors h-9 w-9 sm:h-10 sm:w-10"
              >
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-12">
            <div className="lg:col-span-4 p-4 sm:p-6 md:p-8 lg:border-r border-gray-100 order-2 lg:order-1">
              <NotesPanel startDate={startDate} endDate={endDate} monthIndex={monthIndex} />
            </div>

            <div className="lg:col-span-8 order-1 lg:order-2">
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

              <AnimatePresence>
                {startDate && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 md:pb-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4"
                  >
                    <div className="text-xs sm:text-sm font-semibold text-blue-700 bg-gradient-to-r from-blue-50 to-blue-100 px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-blue-200 flex-1 text-center sm:text-left">
                      ✨ {formatDateRange(startDate, endDate)}
                    </div>
                    <Button 
                      variant="ghost" 
                      onClick={clearSelection} 
                      className="text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all rounded-full text-xs sm:text-sm"
                    >
                      Clear
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
