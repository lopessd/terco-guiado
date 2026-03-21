"use client";

import { CheckCircle2, RotateCcw } from "lucide-react";
import type { ThemeConfig } from "@/data/themes";
import { BackgroundWrapper } from "@/components/layout/BackgroundWrapper";
import { AppFooter } from "@/components/layout/AppFooter";

interface FinishedViewProps {
  theme: ThemeConfig;
  onRestart: () => void;
}

export function FinishedView({ theme, onRestart }: FinishedViewProps) {
  return (
    <BackgroundWrapper theme={theme}>
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-cream/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-navy/20 p-8 text-center border border-gold/20">
          <div className="mb-6 flex justify-center text-gold animate-bounce">
            <CheckCircle2 size={64} strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-navy mb-4 tracking-wide">
            Terço Concluído!
          </h2>
          <p className="text-navy/60 mb-8 leading-relaxed font-sans">
            Que a Virgem Maria interceda por si e que esta meditação fortaleça a sua fé.
          </p>
          <button
            onClick={onRestart}
            className="w-full bg-navy hover:bg-navy-light text-gold-light font-serif font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 tracking-wide"
          >
            <RotateCcw size={20} /> Voltar ao Início
          </button>
        </div>
        <AppFooter />
      </div>
    </BackgroundWrapper>
  );
}
