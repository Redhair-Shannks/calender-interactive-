"use client";

import { format } from "date-fns";
import { Upload, RotateCcw, ImageIcon, Link as LinkIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HeroImageProps {
  currentMonth: Date;
  imageUrl: string;
  monthIndex: number;
  onUpload: (monthIndex: number, dataUrl: string) => void;
  onReset: (monthIndex: number) => void;
}

export function HeroImage({ currentMonth, imageUrl, monthIndex, onUpload, onReset }: HeroImageProps) {
  const monthName = format(currentMonth, "MMMM");
  const year = format(currentMonth, "yyyy");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      onUpload(monthIndex, dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleUrlApply = () => {
    const trimmed = urlInput.trim();
    if (trimmed) {
      onUpload(monthIndex, trimmed);   // URL is saved exactly like uploaded images
      setUrlInput("");
      setShowUrlInput(false);
    }
  };

  return (
    <div className="group relative h-56 sm:h-72 md:h-96 w-full overflow-hidden rounded-t-2xl sm:rounded-t-3xl">
      <motion.img
        src={imageUrl}
        alt={`${monthName} hero`}
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.08 }}
        transition={{ duration: 0.6 }}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Multi-layer gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 via-transparent to-transparent" />

      {/* Subtle vignette */}
      <div className="absolute inset-0 shadow-inner" />

      {/* Month display card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute bottom-3 sm:bottom-6 md:bottom-8 right-3 sm:right-6 md:right-8 bg-white/95 backdrop-blur-xl px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20"
      >
        <motion.span 
          className="text-[9px] sm:text-xs font-bold tracking-[2px] sm:tracking-[3px] text-blue-600 uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {year}
        </motion.span>
        <motion.h1 
          className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter text-gray-900 mt-1 sm:mt-2"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          {monthName}
        </motion.h1>
      </motion.div>

      {/* Decorative wall calendar rings */}
      <motion.div 
        className="absolute top-3 sm:top-6 left-1/2 -translate-x-1/2 flex gap-0.5 sm:gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {[...Array(5)].map((_, i) => (
          <motion.div 
            key={i} 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="w-2.5 sm:w-3.5 md:w-4 h-6 sm:h-8 md:h-9 bg-gradient-to-b from-gray-900 to-gray-800 rounded-full shadow-lg flex items-center justify-center text-[8px] sm:text-[10px] md:text-[11px] text-white font-bold border border-gray-700"
          >
            •
          </motion.div>
        ))}
      </motion.div>

      {/* Upload controls - now with URL option */}
      <motion.div 
        className="absolute top-3 sm:top-6 right-3 sm:right-6 flex flex-col gap-1.5 sm:gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
        initial={{ x: 10, opacity: 0 }}
        whileHover={{ x: 0, opacity: 100 }}
      >
        {/* File Upload Button */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            size="sm"
            variant="secondary"
            className="shadow-xl bg-white/95 hover:bg-white text-[11px] sm:text-xs flex items-center gap-1 sm:gap-2 font-semibold px-2 sm:px-3 py-1 sm:py-1.5"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon className="h-3 sm:h-4 w-3 sm:w-4 bg-blue-500" />
            <span className="hidden sm:inline text-black">Change Image</span>
            <span className="sm:hidden">Change</span>
          </Button>
        </motion.div>

        {/* New URL Button */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            size="sm"
            variant="secondary"
            className="shadow-xl bg-white/95 hover:bg-white text-[11px] sm:text-xs flex items-center gap-1 sm:gap-2 font-semibold px-2 sm:px-3 py-1 sm:py-1.5"
            onClick={() => setShowUrlInput(!showUrlInput)}
          >
            <LinkIcon className="h-3 sm:h-4 w-3 sm:w-4 bg-blue-500" />
            <span className="hidden sm:inline text-black">Use URL</span>
            <span className="sm:hidden">URL</span>
          </Button>
        </motion.div>

        {/* Reset Button */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onReset(monthIndex)}
            className="shadow-xl bg-white/95 hover:bg-white text-[11px] sm:text-xs flex items-center gap-1 sm:gap-2 font-semibold px-2 sm:px-3 py-1 sm:py-1.5"
          >
            <RotateCcw className="h-3 sm:h-4 w-3 sm:w-4" />
            <span className="hidden sm:inline">Reset</span>
          </Button>
        </motion.div>

        {/* URL Input - appears when Use URL is clicked */}
        <AnimatePresence>
          {showUrlInput && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="mt-2 bg-white/95 backdrop-blur-xl p-3 rounded-2xl shadow-xl border border-white/30 flex flex-col gap-2"
            >
              <div className="flex items-center gap-2 text-xs font-medium text-black">
                <LinkIcon className="h-3 w-3" />
                Paste image URL
              </div>
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://picsum.photos/id/1015/1200/800"
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-none text-black"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleUrlApply}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Apply
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setShowUrlInput(false);
                    setUrlInput("");
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
}