export interface RosaryNode {
  id: number;
  cx: number;
  cy: number;
  type: "cross" | "large" | "small" | "centerpiece";
}

export function generateRosaryNodes(): RosaryNode[] {
  const nodes: RosaryNode[] = [];

  nodes.push({ id: 0, cx: 50, cy: 110, type: "cross" });
  nodes.push({ id: 1, cx: 50, cy: 100, type: "large" });
  nodes.push({ id: 2, cx: 50, cy: 94, type: "small" });
  nodes.push({ id: 3, cx: 50, cy: 88, type: "small" });
  nodes.push({ id: 4, cx: 50, cy: 82, type: "small" });
  nodes.push({ id: 5, cx: 50, cy: 74, type: "large" });
  nodes.push({ id: 6, cx: 50, cy: 65, type: "centerpiece" });

  const cxCenter = 50;
  const cyCenter = 35;
  const rx = 40;
  const ry = 25;
  const startAngle = Math.PI / 2 - 0.15;
  const totalAngle = -(Math.PI * 2 - 0.3);

  for (let i = 0; i < 55; i++) {
    const angle = startAngle + (i / 54) * totalAngle;
    const cx = cxCenter + rx * Math.cos(angle);
    const cy = cyCenter + ry * Math.sin(angle);
    const isLarge = i % 11 === 0;
    nodes.push({ id: 7 + i, cx, cy, type: isLarge ? "large" : "small" });
  }

  return nodes;
}

export const ROSARY_NODES = generateRosaryNodes();

export const TAIL_PATH = "M 50 110 L 50 65";

export const LOOP_PATH = `M 50 65 L ${ROSARY_NODES.filter((n) => n.id >= 7)
  .map((n) => `${n.cx},${n.cy}`)
  .join(" L ")} L 50 65`;
