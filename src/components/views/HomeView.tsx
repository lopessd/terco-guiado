"use client";

import { Play } from "lucide-react";
import type { MysteryKey } from "@/data/mysteries";
import type { ThemeConfig } from "@/data/themes";
import { BackgroundWrapper } from "@/components/layout/BackgroundWrapper";
import { IntroOverlay } from "@/components/overlays/IntroOverlay";
import { MysterySelector } from "@/components/cards/MysterySelector";
import { AppFooter } from "@/components/layout/AppFooter";

interface HomeViewProps {
  theme: ThemeConfig;
  introState: "idle" | "playing" | "fading" | "done";
  selectedMysteryKey: MysteryKey;
  onSelectMystery: (key: MysteryKey) => void;
  onStart: () => void;
}

export function HomeView({
  theme,
  introState,
  selectedMysteryKey,
  onSelectMystery,
  onStart,
}: HomeViewProps) {
  return (
    <BackgroundWrapper theme={theme}>
      <IntroOverlay introState={introState} />
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-cream/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-navy/20 overflow-hidden p-6 text-center border border-gold/20">
          <div className="mb-4 flex justify-center">
            <img src="/logo.png" alt="Terço Guiado" className="h-24 w-auto" />
          </div>

          <MysterySelector selectedKey={selectedMysteryKey} onSelect={onSelectMystery} />

          <button
            onClick={onStart}
            className="w-full bg-navy hover:bg-navy-light text-gold-light font-serif font-bold text-lg py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-navy/30 tracking-wide"
          >
            <Play size={20} /> Começar a Rezar
          </button>
        </div>
        <AppFooter />
      </div>
    </BackgroundWrapper>
  );
}
