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
        <div className="max-w-md w-full bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 text-center border border-white/20">
          <div className={`mb-6 flex justify-center ${theme.primaryText} animate-bounce`}>
            <CheckCircle2 size={64} strokeWidth={1.5} />
          </div>
          <h2 className="text-2xl font-light text-slate-900 mb-4">Terço Concluído!</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Que a Virgem Maria interceda por si e que esta meditação fortaleça a sua fé.
          </p>
          <button
            onClick={onRestart}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw size={20} /> Voltar ao Início
          </button>
        </div>
      </div>
      <AppFooter />
    </BackgroundWrapper>
  );
}
