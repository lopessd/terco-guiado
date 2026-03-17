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
    <div className="w-full h-[35vh] min-h-[250px] max-h-[400px] mb-8 relative flex items-center justify-center">
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 ${theme.primaryBg} rounded-full blur-[100px] opacity-30 pointer-events-none`}
      />
      <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-2xl" preserveAspectRatio="xMidYMid meet">
        <path d={TAIL_PATH} stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" fill="none" />
        <path d={LOOP_PATH} stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" fill="none" />

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
