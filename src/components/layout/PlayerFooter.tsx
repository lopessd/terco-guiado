"use client";

import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import type { PlaybackSpeed } from "@/hooks/useAudio";

interface PlayerFooterProps {
  isPlaying: boolean;
  isPaused: boolean;
  isWaiting: boolean;
  playbackSpeed: PlaybackSpeed;
  globalProgress: number;
  elapsedTime: number;
  totalTime: number;
  durationsLoaded: boolean;
  canGoBack: boolean;
  isTransitioning: boolean;
  onPause: () => void;
  onResume: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSpeedChange: (speed: PlaybackSpeed) => void;
}

const SPEEDS: PlaybackSpeed[] = [1, 1.5, 2];

function formatTime(seconds: number): string {
  if (!seconds || seconds <= 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function PlayerFooter({
  isPlaying,
  isPaused,
  isWaiting,
  playbackSpeed,
  globalProgress,
  elapsedTime,
  totalTime,
  durationsLoaded,
  canGoBack,
  isTransitioning,
  onPause,
  onResume,
  onPrev,
  onNext,
  onSpeedChange,
}: PlayerFooterProps) {
  const nextSpeed = () => {
    const idx = SPEEDS.indexOf(playbackSpeed);
    onSpeedChange(SPEEDS[(idx + 1) % SPEEDS.length]);
  };

  const showPlay = isPaused || (!isPlaying && !isWaiting);

  return (
    <footer className="fixed bottom-0 w-full z-40">
      {/* Progress section */}
      <div className="bg-navy-dark/90 backdrop-blur-xl border-t border-gold/10">
        {/* Progress bar */}
        <div className="max-w-2xl mx-auto px-4 pt-3">
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full transition-[width] duration-200 ease-linear"
              style={{ width: `${globalProgress * 100}%` }}
            />
          </div>

          {/* Time labels */}
          <div className="flex justify-between mt-1 mb-2">
            <span className="text-[11px] font-sans text-cream/50 tabular-nums">
              {formatTime(elapsedTime)}
            </span>
            <span className="text-[11px] font-sans text-cream/50 tabular-nums">
              {durationsLoaded ? formatTime(totalTime) : "--:--"}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="max-w-2xl mx-auto px-4 pb-4 flex items-center justify-between">
          {/* Speed button */}
          <button
            onClick={nextSpeed}
            className="w-12 h-10 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition text-cream font-sans font-bold text-sm"
          >
            {playbackSpeed}x
          </button>

          {/* Transport controls */}
          <div className="flex items-center gap-5">
            <button
              onClick={onPrev}
              disabled={!canGoBack || isTransitioning}
              className="text-cream/70 hover:text-cream disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <SkipBack size={28} />
            </button>

            <button
              onClick={showPlay ? onResume : onPause}
              disabled={isTransitioning}
              className="w-14 h-14 flex items-center justify-center rounded-full bg-gold hover:bg-gold-light text-navy transition-all shadow-lg shadow-gold/20 disabled:opacity-50"
            >
              {showPlay ? (
                <Play size={28} className="ml-1" />
              ) : (
                <Pause size={28} />
              )}
            </button>

            <button
              onClick={onNext}
              disabled={isTransitioning}
              className="text-cream/70 hover:text-cream disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <SkipForward size={28} />
            </button>
          </div>

          {/* Waiting indicator / spacer */}
          <div className="w-12 h-10 flex items-center justify-center">
            {isWaiting && (
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
