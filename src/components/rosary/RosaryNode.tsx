"use client";

import type { RosaryNode as RosaryNodeType } from "@/utils/rosaryGeometry";
import type { ThemeConfig } from "@/data/themes";

interface RosaryNodeProps {
  node: RosaryNodeType;
  isCompleted: boolean;
  isActive: boolean;
  theme: ThemeConfig;
}

export function RosaryNode({ node, isCompleted, isActive, theme }: RosaryNodeProps) {
  const fill = isCompleted
    ? theme.svgCompleted
    : isActive
    ? theme.svgActive
    : "rgba(255,255,255,0.2)";

  if (node.type === "cross") {
    return (
      <g className={isActive ? "animate-pulse" : "transition-colors duration-500"}>
        <line x1={node.cx} y1={node.cy - 5} x2={node.cx} y2={node.cy + 5} stroke={fill} strokeWidth="1.5" strokeLinecap="round" />
        <line x1={node.cx - 4} y1={node.cy - 2} x2={node.cx + 4} y2={node.cy - 2} stroke={fill} strokeWidth="1.5" strokeLinecap="round" />
        {isActive && <circle cx={node.cx} cy={node.cy} r="8" fill={theme.svgActive} opacity="0.3" />}
      </g>
    );
  }

  if (node.type === "centerpiece") {
    return (
      <g className="transition-colors duration-500">
        <path
          d={`M ${node.cx} ${node.cy - 3} L ${node.cx + 3} ${node.cy + 2} L ${node.cx - 3} ${node.cy + 2} Z`}
          fill={fill}
          stroke="rgba(0,0,0,0.3)"
          strokeWidth="0.5"
        />
        {isActive && (
          <circle cx={node.cx} cy={node.cy} r="7" fill={theme.svgActive} opacity="0.4" className="animate-pulse" />
        )}
      </g>
    );
  }

  const r = node.type === "large" ? 1.8 : 1.2;
  return (
    <g className="transition-all duration-500">
      <circle cx={node.cx} cy={node.cy} r={r} fill={fill} stroke="rgba(0,0,0,0.3)" strokeWidth="0.2" />
      {isActive && (
        <circle cx={node.cx} cy={node.cy} r={r * 3} fill={theme.svgActive} opacity="0.4" className="animate-pulse" />
      )}
    </g>
  );
}
