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
    <header className="p-4 flex items-center justify-between bg-navy-dark/60 backdrop-blur-xl sticky top-0 z-40 border-b border-gold/15 shadow-sm">
      <button
        onClick={onRestart}
        className="text-gold-light hover:text-gold p-2 rounded-full bg-white/10 transition"
      >
        <RotateCcw size={18} />
      </button>
      <div className="text-center flex-1 text-cream">
        <span className="text-[10px] md:text-xs font-serif font-extrabold uppercase tracking-[0.2em] block text-gold-light">
          {mysteryName}
        </span>
        <span className="text-xs font-sans font-semibold text-cream/60">
          Passo {currentStepIndex + 1} de {totalSteps}
        </span>
      </div>
      <button
        onClick={onToggleAudio}
        className={`p-2 rounded-full transition-all flex items-center gap-2 text-sm font-medium ${
          isAudioEnabled
            ? "bg-gold/30 text-gold-light shadow-inner"
            : "bg-white/10 text-cream/60 hover:text-cream"
        }`}
      >
        {isAudioEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
      </button>
      <div className="absolute bottom-0 left-0 h-[2px] bg-navy-dark/40 w-full">
        <div
          className="h-[2px] bg-gold transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </header>
  );
}
