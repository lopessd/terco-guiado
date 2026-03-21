"use client";

import { ROSARY_NODES, TAIL_PATH, LOOP_PATH } from "@/utils/rosaryGeometry";
import type { ThemeConfig } from "@/data/themes";
import { RosaryNode } from "./RosaryNode";

interface RosaryVisualProps {
  theme: ThemeConfig;
  currentActiveNodeId: number;
}

export function RosaryVisual({ theme, currentActiveNodeId }: RosaryVisualProps) {
  return (
    <div className="w-full h-[45vh] min-h-[300px] max-h-[500px] mb-6 relative flex items-center justify-center">
      <svg viewBox="10 2 80 148" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          {/* Gradiente para contas inativas (azul marinho) */}
          <radialGradient id="bead-inactive" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#4A6FA5" />
            <stop offset="40%" stopColor="#2A4A7F" />
            <stop offset="100%" stopColor="#0F2340" />
          </radialGradient>

          {/* Gradiente para contas completas (dourado) */}
          <radialGradient id="bead-completed" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#E8C86A" />
            <stop offset="40%" stopColor="#C4962E" />
            <stop offset="100%" stopColor="#8B6914" />
          </radialGradient>

          {/* Gradiente para conta ativa (dourado brilhante) */}
          <radialGradient id="bead-active" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFF3C4" />
            <stop offset="30%" stopColor="#F5D56A" />
            <stop offset="70%" stopColor="#D4AD4A" />
            <stop offset="100%" stopColor="#A67B1E" />
          </radialGradient>

          {/* Brilho para glow ativo */}
          <radialGradient id="glow-active" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#D4AD4A" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#D4AD4A" stopOpacity="0" />
          </radialGradient>

          {/* Reflexo de luz para contas */}
          <radialGradient id="bead-highlight" cx="30%" cy="25%" r="30%">
            <stop offset="0%" stopColor="white" stopOpacity="0.7" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>

          {/* Sombra */}
          <filter id="bead-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0.3" dy="0.5" stdDeviation="0.4" floodColor="#000" floodOpacity="0.35" />
          </filter>

          {/* Sombra do glow */}
          <filter id="glow-filter" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Cordão da cauda */}
        <path
          d={TAIL_PATH}
          stroke="#8B7355"
          strokeWidth="0.5"
          fill="none"
          opacity="0.7"
        />

        {/* Cordão do loop */}
        <path
          d={LOOP_PATH}
          stroke="#8B7355"
          strokeWidth="0.5"
          fill="none"
          opacity="0.7"
        />

        {ROSARY_NODES.map((node) => (
          <RosaryNode
            key={node.id}
            node={node}
            isCompleted={node.id < currentActiveNodeId}
            isActive={node.id === currentActiveNodeId}
            theme={theme}
          />
        ))}
      </svg>
    </div>
  );
}
