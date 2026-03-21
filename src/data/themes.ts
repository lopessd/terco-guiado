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
    image: "/bg-default.webp",
    primaryText: "text-navy",
    primaryBg: "bg-navy",
    primaryHover: "hover:bg-navy-light",
    lightBg: "bg-cream",
    border: "border-gold/30",
    shadow: "shadow-navy/20",
    svgCompleted: "#C4962E",
    svgActive: "#D4AD4A",
  },
  luminosos: {
    image: "/bg-default.webp",
    primaryText: "text-navy",
    primaryBg: "bg-navy",
    primaryHover: "hover:bg-navy-light",
    lightBg: "bg-cream",
    border: "border-gold/30",
    shadow: "shadow-navy/20",
    svgCompleted: "#C4962E",
    svgActive: "#D4AD4A",
  },
  dolorosos: {
    image: "/bg-default.webp",
    primaryText: "text-navy",
    primaryBg: "bg-navy",
    primaryHover: "hover:bg-navy-light",
    lightBg: "bg-cream",
    border: "border-gold/30",
    shadow: "shadow-navy/20",
    svgCompleted: "#C4962E",
    svgActive: "#D4AD4A",
  },
  gloriosos: {
    image: "/bg-default.webp",
    primaryText: "text-navy",
    primaryBg: "bg-navy",
    primaryHover: "hover:bg-navy-light",
    lightBg: "bg-cream",
    border: "border-gold/30",
    shadow: "shadow-navy/20",
    svgCompleted: "#C4962E",
    svgActive: "#D4AD4A",
  },
};
