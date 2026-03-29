"use client";

import { useState } from "react";
import { Hand, Play, ArrowLeft, Volume2, VolumeX } from "lucide-react";
import type { ThemeConfig } from "@/data/themes";
import { BackgroundWrapper } from "@/components/layout/BackgroundWrapper";

interface ModeSelectionViewProps {
  theme: ThemeConfig;
  mysteryName: string;
  onConfirm: (mode: "manual" | "auto", withAudio: boolean) => void;
  onBack: () => void;
}

export function ModeSelectionView({
  theme,
  mysteryName,
  onConfirm,
  onBack,
}: ModeSelectionViewProps) {
  const [selected, setSelected] = useState<"manual" | "auto">("auto");
  const [withAudio, setWithAudio] = useState(true);

  return (
    <BackgroundWrapper theme={theme}>
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-cream/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-navy/20 overflow-hidden p-6 text-center border border-gold/20">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-sm font-sans text-navy/50 hover:text-navy transition-colors mb-4"
          >
            <ArrowLeft size={16} /> Voltar
          </button>

          <p className="text-xs font-medium text-navy/50 uppercase tracking-[0.2em] mb-1 font-sans">
            {mysteryName}
          </p>
          <h1 className="text-2xl font-serif font-bold text-navy mb-6 tracking-wide">
            Como deseja rezar?
          </h1>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              onClick={() => setSelected("manual")}
              className={`flex flex-col items-center p-5 rounded-2xl border transition-all duration-300 ${
                selected === "manual"
                  ? "bg-navy text-gold-light shadow-md border-gold/30 scale-[1.02]"
                  : "bg-white/60 text-navy hover:bg-white border-transparent hover:border-gold/20"
              }`}
            >
              <Hand
                size={32}
                className={`mb-3 ${selected === "manual" ? "text-gold" : "text-navy/40"}`}
              />
              <span className="font-serif font-bold text-base tracking-wide">Manual</span>
              <span
                className={`text-xs font-sans mt-1 ${
                  selected === "manual" ? "text-white/70" : "text-navy/40"
                }`}
              >
                Você controla o ritmo
              </span>
            </button>

            <button
              onClick={() => setSelected("auto")}
              className={`flex flex-col items-center p-5 rounded-2xl border transition-all duration-300 ${
                selected === "auto"
                  ? "bg-navy text-gold-light shadow-md border-gold/30 scale-[1.02]"
                  : "bg-white/60 text-navy hover:bg-white border-transparent hover:border-gold/20"
              }`}
            >
              <Play
                size={32}
                className={`mb-3 ${selected === "auto" ? "text-gold" : "text-navy/40"}`}
              />
              <span className="font-serif font-bold text-base tracking-wide">Automático</span>
              <span
                className={`text-xs font-sans mt-1 ${
                  selected === "auto" ? "text-white/70" : "text-navy/40"
                }`}
              >
                As orações avançam sozinhas
              </span>
            </button>
          </div>

          {/* Audio toggle — only for manual mode */}
          {selected === "manual" && (
            <div className="mb-4 animate-fadeIn">
              <p className="text-xs font-medium text-navy/50 uppercase tracking-[0.15em] mb-2 font-sans">
                Deseja ouvir a voz?
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setWithAudio(true)}
                  className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-sm font-sans font-medium transition-all duration-300 ${
                    withAudio
                      ? "bg-navy text-gold-light border-gold/30"
                      : "bg-white/60 text-navy/60 border-transparent hover:bg-white hover:border-gold/20"
                  }`}
                >
                  <Volume2 size={16} /> Com voz
                </button>
                <button
                  onClick={() => setWithAudio(false)}
                  className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-sm font-sans font-medium transition-all duration-300 ${
                    !withAudio
                      ? "bg-navy text-gold-light border-gold/30"
                      : "bg-white/60 text-navy/60 border-transparent hover:bg-white hover:border-gold/20"
                  }`}
                >
                  <VolumeX size={16} /> Sem voz
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => onConfirm(selected, selected === "auto" ? true : withAudio)}
            className="w-full bg-navy hover:bg-navy-light text-gold-light font-serif font-bold text-lg py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-navy/30 tracking-wide"
          >
            Confirmar
          </button>
        </div>
      </div>
    </BackgroundWrapper>
  );
}
