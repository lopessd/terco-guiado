import type { MysteryKey } from "./mysteries";

export interface ThemeConfig {
  image: string;
  primaryText: string;
  primaryBg: string;
  primaryHover: string;
  lightBg: string;
  border: string;
  shadow: string;
  svgCompleted: string;
  svgActive: string;
}

export const THEMES: Record<MysteryKey, ThemeConfig> = {
  gozosos: {
    image: "/images/themes/gozosos.jpg",
    primaryText: "text-amber-700",
    primaryBg: "bg-amber-700",
    primaryHover: "hover:bg-amber-800",
    lightBg: "bg-amber-50",
    border: "border-amber-200",
    shadow: "shadow-amber-200",
    svgCompleted: "#b45309",
    svgActive: "#fbbf24",
  },
  luminosos: {
    image: "/images/themes/luminosos.jpg",
    primaryText: "text-amber-700",
    primaryBg: "bg-amber-700",
    primaryHover: "hover:bg-amber-800",
    lightBg: "bg-amber-50",
    border: "border-amber-200",
    shadow: "shadow-amber-200",
    svgCompleted: "#b45309",
    svgActive: "#fbbf24",
  },
  dolorosos: {
    image: "/images/themes/dolorosos.jpg",
    primaryText: "text-amber-700",
    primaryBg: "bg-amber-700",
    primaryHover: "hover:bg-amber-800",
    lightBg: "bg-amber-50",
    border: "border-amber-200",
    shadow: "shadow-amber-200",
    svgCompleted: "#b45309",
    svgActive: "#fbbf24",
  },
  gloriosos: {
    image: "/images/themes/gloriosos.jpg",
    primaryText: "text-amber-700",
    primaryBg: "bg-amber-700",
    primaryHover: "hover:bg-amber-800",
    lightBg: "bg-amber-50",
    border: "border-amber-200",
    shadow: "shadow-amber-200",
    svgCompleted: "#b45309",
    svgActive: "#fbbf24",
  },
};
