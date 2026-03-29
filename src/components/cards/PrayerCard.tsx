"use client";

import { useMemo } from "react";
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
  audioProgress: number;
  onPlayToggle: () => void;
}

function getBeadsTitle(step: RosaryStep, beadCount: number): string {
  if (step.type !== "beads") return step.title;
  return `${step.title.replace(/^\d+\s/, "")} ${beadCount + 1}/${step.beadIds.length}`;
}

interface TextToken {
  text: string;
  isBreak: boolean;
}

function tokenize(text: string): TextToken[] {
  const tokens: TextToken[] = [];
  const lines = text.split("\n");
  lines.forEach((line, lineIdx) => {
    if (line === "") {
      tokens.push({ text: "\n", isBreak: true });
    } else {
      const words = line.split(/\s+/).filter(Boolean);
      words.forEach((word) => {
        tokens.push({ text: word, isBreak: false });
      });
    }
    if (lineIdx < lines.length - 1 && line !== "") {
      tokens.push({ text: "\n", isBreak: true });
    }
  });
  return tokens;
}

export function PrayerCard({
  step,
  beadCount,
  displaySubtitle,
  theme,
  isAudioEnabled,
  isPlaying,
  audioProgress,
  onPlayToggle,
}: PrayerCardProps) {
  const title = step.type === "beads" ? getBeadsTitle(step, beadCount) : step.title;

  const tokens = useMemo(() => tokenize(step.text), [step.text]);
  const wordCount = useMemo(() => tokens.filter((t) => !t.isBreak).length, [tokens]);

  // No audio → all words highlighted; otherwise slight lead so it feels in sync
  const allVisible = !isAudioEnabled || audioProgress === 0 && !isPlaying;
  const leadProgress = Math.min(audioProgress + 0.04, 1);
  const highlightedWords = allVisible ? wordCount : Math.floor(leadProgress * wordCount);

  let wordIdx = 0;

  return (
    <div className="text-center animate-fadeIn flex flex-col items-center">
      <div className="bg-navy-dark/40 backdrop-blur-md px-6 py-2 rounded-full shadow-sm mb-4 inline-block border border-gold/20">
        <h2 className="text-xl md:text-2xl font-serif font-bold text-gold-light tracking-wide">{title}</h2>
      </div>

      {displaySubtitle && (
        <p className="bg-navy-dark/50 text-cream/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-sans font-medium mb-6 border border-gold/10">
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
        <p className="text-lg md:text-xl leading-relaxed font-serif font-medium text-left">
          {tokens.map((token, i) => {
            if (token.isBreak) {
              return <br key={i} />;
            }
            const currentWordIdx = wordIdx++;
            const isHighlighted = currentWordIdx < highlightedWords;
            return (
              <span
                key={i}
                className={`transition-colors duration-150 ${
                  isHighlighted ? "text-navy" : "text-navy/30"
                }`}
              >
                {currentWordIdx > 0 ? " " : ""}{token.text}
              </span>
            );
          })}
        </p>
      </div>
    </div>
  );
}
