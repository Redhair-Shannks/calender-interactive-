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

const MONTH_COLORS: Record<number, string> = {
  0: "#1e40af", // Jan — deep blue
  1: "#be185d", // Feb — rose
  2: "#15803d", // Mar — green
  3: "#b45309", // Apr — amber
  4: "#9333ea", // May — purple
  5: "#0f766e", // Jun — teal
  6: "#dc2626", // Jul — red
  7: "#1d4ed8", // Aug — blue
  8: "#c2410c", // Sep — orange
  9: "#6d28d9", // Oct — violet
  10: "#7c2d12", // Nov — brown
  11: "#1e3a5f", // Dec — midnight
};

export function HeroImage({ currentMonth, imageUrl, monthIndex, onUpload, onReset }: HeroImageProps) {
  const monthName = format(currentMonth, "MMMM");
  const year = format(currentMonth, "yyyy");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const accentColor = MONTH_COLORS[monthIndex] ?? "#1e40af";
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [imgKey, setImgKey] = useState(0);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      onUpload(monthIndex, ev.target?.result as string);
      setImgKey((k) => k + 1);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleUrlApply = () => {
    const trimmed = urlInput.trim();
    if (trimmed) {
      onUpload(monthIndex, trimmed);
      setUrlInput("");
      setShowUrlInput(false);
      setImgKey((k) => k + 1);
    }
  };

  return (
    <div className="relative h-52 sm:h-72 md:h-96 w-full overflow-hidden group">
      {/* Hero image — Ken Burns slow zoom on mount + re-render key */}
      <motion.img
        key={`${imageUrl}-${imgKey}`}
        src={imageUrl}
        alt={`${monthName} calendar photo`}
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Subtle overlays to keep text readable while preserving image */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.1) 35%, transparent 70%)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent" />

      {/* Month heading — top right, closer to wall-calendar style */}
      <motion.div
        key={monthName}
        initial={{ opacity: 0, y: 16, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        className="absolute top-5 sm:top-7 md:top-8 right-4 sm:right-6 md:right-8 px-1 sm:px-2 py-1 text-right select-none"
      >
        <p
          className="text-[11px] sm:text-xs font-semibold tracking-[0.12em] text-white/90"
        >
          {year}
        </p>
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-white leading-none"
          style={{ fontFamily: "Georgia, Times New Roman, serif" }}
        >
          {monthName}
        </h1>
      </motion.div>

      {/* Upload controls — restored with improved styling + old descriptive labels */}
      <motion.div
        initial={{ opacity: 80, x: 8 }}
        className="absolute top-3 sm:top-4 left-3 sm:left-4 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20"
      >
        <ControlButton
          onClick={() => fileInputRef.current?.click()}
          icon={<ImageIcon className="h-3.5 w-3.5" />}
          label="Change Image"
        />
        <ControlButton
          onClick={() => setShowUrlInput((v) => !v)}
          icon={<LinkIcon className="h-3.5 w-3.5" />}
          label="Use URL"
          active={showUrlInput}
        />
        <ControlButton
          onClick={() => {
            onReset(monthIndex);
            setImgKey((k) => k + 1);
          }}
          icon={<RotateCcw className="h-3.5 w-3.5" />}
          label="Reset"
          variant="outline"
        />

        {/* URL input popover — improved with old design feel */}
        <AnimatePresence>
          {showUrlInput && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.18 }}
              className="mt-1 bg-white/97 backdrop-blur-xl p-3 rounded-2xl shadow-2xl border border-gray-100 flex flex-col gap-2 w-56"
            >
              <p className="text-[11px] font-semibold text-gray-700 flex items-center gap-1.5">
                <LinkIcon className="h-3 w-3 text-blue-500" />
                Paste image URL
              </p>
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleUrlApply()}
                placeholder="https://picsum.photos/id/1015/1200/800"
                autoFocus
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:border-blue-400 focus:outline-none text-gray-800 bg-gray-50"
              />
              <div className="flex gap-1.5">
                <button
                  onClick={handleUrlApply}
                  className="flex-1 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
                >
                  Apply
                </button>
                <button
                  onClick={() => {
                    setShowUrlInput(false);
                    setUrlInput("");
                  }}
                  className="px-2 py-1.5 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

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

function ControlButton({
  onClick,
  icon,
  label,
  active,
  variant = "default",
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  variant?: "default" | "outline";
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.93 }}
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-lg transition-colors ${
        active
          ? "bg-blue-600 text-white"
          : variant === "outline"
          ? "bg-white/90 border border-gray-200 text-gray-600 hover:bg-white"
          : "bg-white/90 text-gray-700 hover:bg-white"
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
      <span className="sm:hidden">{label === "Change Image" ? "Img" : label}</span>
    </motion.button>
  );
}