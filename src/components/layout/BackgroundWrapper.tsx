"use client";

import type { ThemeConfig } from "@/data/themes";
import type { ReactNode } from "react";

interface BackgroundWrapperProps {
  theme: ThemeConfig;
  mysteryImage?: string;
  children: ReactNode;
}

export function BackgroundWrapper({ theme, mysteryImage, children }: BackgroundWrapperProps) {
  const bgImage = mysteryImage || theme.image;

  return (
    <div className="min-h-screen relative flex flex-col font-sans text-slate-800 selection:bg-white/30">
      {/* Imagem de fundo */}
      <img
        key={bgImage}
        src={bgImage}
        alt=""
        className="fixed inset-0 z-0 w-full h-full object-cover"
      />
      {/* Overlay escuro suave para legibilidade */}
      <div className="fixed inset-0 z-[1] bg-black/40" />
      {/* Conteúdo */}
      <div className="relative z-10 flex-1 flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  );
}
