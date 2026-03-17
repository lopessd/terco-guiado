"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ThemeConfig } from "@/data/themes";

interface PrayingFooterProps {
  theme: ThemeConfig;
  isBeads: boolean;
  canGoBack: boolean;
  isTransitioning: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export function PrayingFooter({
  theme,
  isBeads,
  canGoBack,
  isTransitioning,
  onPrev,
  onNext,
}: PrayingFooterProps) {
  return (
    <footer className="fixed bottom-0 w-full p-4 md:p-6 bg-slate-950/80 backdrop-blur-xl border-t border-white/10 z-40">
      <div className="max-w-2xl mx-auto flex gap-3 md:gap-4">
        <button
          onClick={onPrev}
          disabled={!canGoBack || isTransitioning}
          className="flex-[1] py-4 flex items-center justify-center text-white bg-white/10 hover:bg-white/20 rounded-2xl disabled:opacity-30 disabled:cursor-not-allowed transition border border-white/10 shadow-sm"
        >
          <ChevronLeft size={24} />
          <span className="hidden md:inline ml-1 font-medium">Voltar</span>
        </button>

        <button
          onClick={onNext}
          disabled={isTransitioning}
          className={`flex-[3] py-4 flex items-center justify-center gap-2 text-white ${theme.primaryBg} ${theme.primaryHover} rounded-2xl font-semibold text-lg shadow-xl shadow-black/30 transition transform active:scale-[0.98] border border-white/20 disabled:opacity-50 disabled:active:scale-100`}
        >
          {isBeads ? "Avançar Conta" : "Continuar Oração"}
          <ChevronRight size={22} />
        </button>
      </div>
    </footer>
  );
}
