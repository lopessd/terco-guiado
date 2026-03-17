import type { MysteryKey } from "./mysteries";

export interface ThemeConfig {
  image: string;
  primaryText: string;
  primaryBg: string;
  primaryHover: string;
  lightBg: string;
  border: string;
  shadow: string;
  overlay: string;
  svgCompleted: string;
  svgActive: string;
}

export const THEMES: Record<MysteryKey, ThemeConfig> = {
  gozosos: {
    image: "/images/themes/gozosos.jpg",
    primaryText: "text-blue-600",
    primaryBg: "bg-blue-600",
    primaryHover: "hover:bg-blue-700",
    lightBg: "bg-blue-50",
    border: "border-blue-100",
    shadow: "shadow-blue-200",
    overlay: "from-blue-900/80 to-slate-900/95",
    svgCompleted: "#3b82f6",
    svgActive: "#fbbf24",
  },
  luminosos: {
    image: "/images/themes/luminosos.jpg",
    primaryText: "text-amber-600",
    primaryBg: "bg-amber-500",
    primaryHover: "hover:bg-amber-600",
    lightBg: "bg-amber-50",
    border: "border-amber-100",
    shadow: "shadow-amber-200",
    overlay: "from-amber-900/80 to-slate-900/95",
    svgCompleted: "#d97706",
    svgActive: "#fef08a",
  },
  dolorosos: {
    image: "/images/themes/dolorosos.jpg",
    primaryText: "text-rose-700",
    primaryBg: "bg-rose-700",
    primaryHover: "hover:bg-rose-800",
    lightBg: "bg-rose-50",
    border: "border-rose-100",
    shadow: "shadow-rose-200",
    overlay: "from-rose-950/90 to-slate-950/98",
    svgCompleted: "#be123c",
    svgActive: "#fca5a5",
  },
  gloriosos: {
    image: "/images/themes/gloriosos.jpg",
    primaryText: "text-yellow-600",
    primaryBg: "bg-yellow-500",
    primaryHover: "hover:bg-yellow-600",
    lightBg: "bg-yellow-50",
    border: "border-yellow-100",
    shadow: "shadow-yellow-200",
    overlay: "from-yellow-900/80 to-slate-900/95",
    svgCompleted: "#ca8a04",
    svgActive: "#fef08a",
  },
};
