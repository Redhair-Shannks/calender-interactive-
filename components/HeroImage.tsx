"use client";

import { format } from "date-fns";
import { Upload, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

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

  return (
    <div className="group relative h-80 w-full overflow-hidden rounded-t-3xl">
      <img
        src={imageUrl}
        alt={`${monthName} hero`}
        className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-600/60" />

      <div className="absolute bottom-8 right-8 bg-white/95 backdrop-blur-md px-8 py-4 rounded-3xl shadow-xl flex flex-col items-end">
        <span className="text-xs font-medium tracking-[2px] text-blue-600">{year}</span>
        <h1 className="text-5xl font-bold tracking-tighter text-gray-900">{monthName}</h1>
      </div>

      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-1">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-3 h-7 bg-zinc-800 rounded-full shadow-inner flex items-center justify-center text-[10px] text-white font-bold">
            •
          </div>
        ))}
      </div>

      {/* Upload controls */}
      <div className="absolute top-6 right-6 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="sm"
          variant="secondary"
          className="shadow-lg bg-white/90 hover:bg-white text-xs flex items-center gap-1"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-3 w-3" />
          Change Image
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => onReset(monthIndex)}
          className="shadow-lg bg-white/90 hover:bg-white text-xs flex items-center gap-1"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </Button>
      </div>

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