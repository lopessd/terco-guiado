"use client";

import { Play, PauseCircle } from "lucide-react";
import type { RosaryStep } from "@/utils/rosarySteps";
import type { ThemeConfig } from "@/data/themes";

interface PrayerCardProps {
  step: RosaryStep;
  beadCount: number;
  displaySubtitle: string | undefined;
  theme: ThemeConfig;
  isAudioEnabled: boolean;
  isPlaying: boolean;
  onPlayToggle: () => void;
}

function getBeadsTitle(step: RosaryStep, beadCount: number): string {
  if (step.type !== "beads") return step.title;
  return `${step.title.replace(/^\d+\s/, "")} ${beadCount + 1}/${step.beadIds.length}`;
}

export function PrayerCard({
  step,
  beadCount,
  displaySubtitle,
  theme,
  isAudioEnabled,
  isPlaying,
  onPlayToggle,
}: PrayerCardProps) {
  const title = step.type === "beads" ? getBeadsTitle(step, beadCount) : step.title;

  return (
    <div className="text-center animate-fadeIn flex flex-col items-center">
      <div className="bg-navy-dark/40 backdrop-blur-md px-6 py-2 rounded-full shadow-sm mb-4 inline-block border border-gold/20">
        <h2 className="text-xl md:text-2xl font-serif font-extrabold text-gold-light tracking-wide">{title}</h2>
      </div>

      {displaySubtitle && (
        <p className="bg-navy-dark/50 text-cream/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-sans font-semibold mb-6 border border-gold/10">
          {displaySubtitle}
        </p>
      )}

      <div className="bg-cream/95 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] shadow-2xl border border-gold/20 w-full relative">
        {!isAudioEnabled && (
          <button
            onClick={onPlayToggle}
            className={`absolute -top-5 right-6 bg-cream border border-gold/30 shadow-md rounded-full p-3 flex items-center gap-2 transition-transform hover:scale-110 ${
              isPlaying
                ? "text-navy"
                : "text-navy/40 hover:text-navy"
            }`}
          >
            {isPlaying ? (
              <PauseCircle size={24} className="animate-pulse" />
            ) : (
              <Play size={24} className="ml-1" />
            )}
          </button>
        )}
        <p className="text-lg md:text-xl text-navy leading-relaxed whitespace-pre-line font-serif font-semibold text-left">
          {step.text}
        </p>
      </div>
    </div>
  );
}
