import { colors } from "@/theme/tokens";

const LEGACY_EVENT_COLORS: Record<string, string> = {
  "#22c55e": colors.success,
  "#4ebce9": colors.pacific,
  "#1a3a6b": colors.kpmgBlue,
  "#0d9488": colors.cobalt,
  "#e91e8c": colors.pink,
  "#ef4444": colors.error,
  "#0a192f": colors.navy,
};

const TOKEN_COLORS = new Set<string>(Object.values(colors));

export function eventChipColor(color: string): string {
  const normalized = color.trim().toLowerCase();
  if (TOKEN_COLORS.has(color)) return color;
  return LEGACY_EVENT_COLORS[normalized] ?? colors.cobalt;
}
