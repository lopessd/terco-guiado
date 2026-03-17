import type { MysteryKey } from "@/data/mysteries";

export function getMysteryOfTheDay(): MysteryKey {
  const day = new Date().getDay();
  if (day === 1 || day === 6) return "gozosos";
  if (day === 2 || day === 5) return "dolorosos";
  if (day === 3 || day === 0) return "gloriosos";
  if (day === 4) return "luminosos";
  return "gozosos";
}
