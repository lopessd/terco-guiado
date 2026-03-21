"use client";

import { Play } from "lucide-react";
import type { MysteryKey } from "@/data/mysteries";
import type { ThemeConfig } from "@/data/themes";
import { BackgroundWrapper } from "@/components/layout/BackgroundWrapper";
import { IntroOverlay } from "@/components/overlays/IntroOverlay";
import { MysterySelector } from "@/components/cards/MysterySelector";

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
        <div className="max-w-md w-full bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden p-8 text-center border border-white/20">
          <div className="mb-4 flex justify-center">
            <img src="/logo.png" alt="Terço Guiado" className="h-24 w-auto" />
          </div>
          <p className="text-slate-500 mb-8">Deixe-se guiar passo a passo nesta oração.</p>

          <MysterySelector selectedKey={selectedMysteryKey} onSelect={onSelectMystery} />

          <button
            onClick={onStart}
            className={`w-full ${theme.primaryBg} ${theme.primaryHover} text-white font-medium py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${theme.shadow}`}
          >
            <Play size={20} /> Começar a Rezar
          </button>
        </div>
      </div>
    </BackgroundWrapper>
  );
}
