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
      <svg viewBox="5 5 90 140" className="w-full h-full drop-shadow-2xl" preserveAspectRatio="xMidYMid meet">
        <path d={TAIL_PATH} stroke="rgba(255,255,255,0.25)" strokeWidth="0.6" fill="none" />
        <path d={LOOP_PATH} stroke="rgba(255,255,255,0.25)" strokeWidth="0.6" fill="none" />

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
