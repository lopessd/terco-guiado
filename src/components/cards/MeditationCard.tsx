"use client";

import type { MeditationStep } from "@/utils/rosarySteps";
import type { ThemeConfig } from "@/data/themes";

interface MeditationCardProps {
  step: MeditationStep;
  theme: ThemeConfig;
}

export function MeditationCard({ step, theme }: MeditationCardProps) {
  return (
    <div className="animate-fadeIn">
      <div className="bg-white/95 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] shadow-2xl border border-white/50 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
          {step.title}
        </h2>
        <p className="text-sm text-slate-400 uppercase tracking-widest mb-6">
          {step.theme}
        </p>
        <div className={`w-12 h-1 ${theme.primaryBg} opacity-50 mx-auto mb-6 rounded-full`} />
        <p className="text-lg text-slate-700 leading-relaxed">
          {step.text}
        </p>
      </div>
    </div>
  );
}
