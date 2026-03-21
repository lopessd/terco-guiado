"use client";

import type { RosaryNode as RosaryNodeType } from "@/utils/rosaryGeometry";
import type { ThemeConfig } from "@/data/themes";

interface RosaryNodeProps {
  node: RosaryNodeType;
  isCompleted: boolean;
  isActive: boolean;
  theme: ThemeConfig;
}

export function RosaryNode({ node, isCompleted, isActive }: RosaryNodeProps) {
  const gradientId = isActive
    ? "bead-active"
    : isCompleted
    ? "bead-completed"
    : "bead-inactive";

  if (node.type === "cross") {
    const cx = node.cx;
    const cy = node.cy;
    const crossFill = isActive ? "url(#bead-active)" : isCompleted ? "url(#bead-completed)" : "#8B7355";
    const crossStroke = isActive ? "#D4AD4A" : isCompleted ? "#A67B1E" : "#6B5B3E";

    return (
      <g filter="url(#bead-shadow)">
        {isActive && (
          <circle cx={cx} cy={cy} r="9" fill="url(#glow-active)" filter="url(#glow-filter)" />
        )}
        {/* Haste vertical */}
        <rect x={cx - 1} y={cy - 7} width="2" height="14" rx="0.5" fill={crossFill} stroke={crossStroke} strokeWidth="0.3" />
        {/* Haste horizontal */}
        <rect x={cx - 4.5} y={cy - 3.5} width="9" height="2" rx="0.5" fill={crossFill} stroke={crossStroke} strokeWidth="0.3" />
        {/* Detalhes nos braços */}
        <circle cx={cx} cy={cy - 6} r="0.6" fill={crossStroke} opacity="0.5" />
        <circle cx={cx} cy={cy + 6} r="0.6" fill={crossStroke} opacity="0.5" />
        <circle cx={cx - 3.5} cy={cy - 2.5} r="0.6" fill={crossStroke} opacity="0.5" />
        <circle cx={cx + 3.5} cy={cy - 2.5} r="0.6" fill={crossStroke} opacity="0.5" />
      </g>
    );
  }

  if (node.type === "centerpiece") {
    const r = 2.8;
    return (
      <g filter="url(#bead-shadow)">
        {isActive && (
          <circle cx={node.cx} cy={node.cy} r={r * 2.5} fill="url(#glow-active)" filter="url(#glow-filter)" />
        )}
        {/* Aro externo */}
        <circle
          cx={node.cx}
          cy={node.cy}
          r={r}
          fill={`url(#${gradientId})`}
          stroke={isActive ? "#D4AD4A" : isCompleted ? "#A67B1E" : "#4A6FA5"}
          strokeWidth="0.5"
        />
        {/* Aro interno decorativo */}
        <circle
          cx={node.cx}
          cy={node.cy}
          r={r - 1}
          fill="none"
          stroke={isActive || isCompleted ? "#FFF3C4" : "#6B8FC4"}
          strokeWidth="0.3"
          opacity="0.4"
        />
        {/* Cruz interna da medalha */}
        <line x1={node.cx} y1={node.cy - 1.5} x2={node.cx} y2={node.cy + 1.5} stroke={isActive || isCompleted ? "#FFF3C4" : "#8BADD4"} strokeWidth="0.5" opacity="0.6" />
        <line x1={node.cx - 1.2} y1={node.cy - 0.5} x2={node.cx + 1.2} y2={node.cy - 0.5} stroke={isActive || isCompleted ? "#FFF3C4" : "#8BADD4"} strokeWidth="0.5" opacity="0.6" />
        {/* Reflexo */}
        <circle cx={node.cx - 0.8} cy={node.cy - 1} r={r * 0.4} fill="url(#bead-highlight)" />
      </g>
    );
  }

  // Contas normais (small e large)
  const r = node.type === "large" ? 2 : 1.1;

  return (
    <g filter="url(#bead-shadow)">
      {isActive && (
        <circle cx={node.cx} cy={node.cy} r={r * 3} fill="url(#glow-active)" filter="url(#glow-filter)" />
      )}
      {/* Conta principal */}
      <circle
        cx={node.cx}
        cy={node.cy}
        r={r}
        fill={`url(#${gradientId})`}
        stroke={isActive ? "#D4AD4A44" : "rgba(0,0,0,0.15)"}
        strokeWidth="0.2"
      />
      {/* Reflexo de luz */}
      <circle
        cx={node.cx - r * 0.25}
        cy={node.cy - r * 0.3}
        r={r * 0.45}
        fill="url(#bead-highlight)"
      />
    </g>
  );
}
