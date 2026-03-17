"use client";

import { RotateCcw, Volume2, VolumeX } from "lucide-react";

interface PrayingHeaderProps {
  mysteryName: string;
  currentStepIndex: number;
  totalSteps: number;
  isAudioEnabled: boolean;
  onRestart: () => void;
  onToggleAudio: () => void;
}

export function PrayingHeader({
  mysteryName,
  currentStepIndex,
  totalSteps,
  isAudioEnabled,
  onRestart,
  onToggleAudio,
}: PrayingHeaderProps) {
  const progressPercent = (currentStepIndex / totalSteps) * 100;

  return (
    <header className="p-4 flex items-center justify-between bg-white/10 backdrop-blur-xl sticky top-0 z-40 border-b border-white/10 shadow-sm">
      <button
        onClick={onRestart}
        className="text-white hover:text-white/70 p-2 rounded-full bg-white/10 transition"
      >
        <RotateCcw size={18} />
      </button>
      <div className="text-center flex-1 text-white">
        <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest block opacity-90">
          {mysteryName}
        </span>
        <span className="text-xs font-medium opacity-60">
          Passo {currentStepIndex + 1} de {totalSteps}
        </span>
      </div>
      <button
        onClick={onToggleAudio}
        className={`p-2 rounded-full transition-all flex items-center gap-2 text-sm font-medium ${
          isAudioEnabled
            ? "bg-white/30 text-white shadow-inner"
            : "bg-white/10 text-white/60 hover:text-white"
        }`}
      >
        {isAudioEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
      </button>
      <div className="absolute bottom-0 left-0 h-[2px] bg-white/20 w-full">
        <div
          className="h-[2px] bg-white transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </header>
  );
}
