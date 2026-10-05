// Source of truth for color, type, and elevation. Tailwind maps these in globals.css.
export const colors = {
  kpmgBlue: "#00338D",
  cobalt: "#1E49E2",
  lightBlue: "#ABECFF",
  pacific: "#00B8F6",
  navy: "#0D253E",
  sidebar: "#082038",
  purple: "#790DDA",
  pink: "#F83098",
  white: "#FFFFFF",
  surface: "#F7F8FA",
  border: "#E1E7F1",
  text: "#0D253E",
  textMuted: "#506078",
  success: "#1B7F4E",
  error: "#B00020",
} as const;

export const statusColor = {
  new: colors.cobalt,
  in_review: colors.purple,
  in_progress: colors.pink,
  waiting_on_stakeholder: colors.pacific,
  done: colors.success,
  rejected: colors.error,
} as const;

export const font = {
  family: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
  h1: { size: "24px", weight: 600, lineHeight: "32px" },
  h2: { size: "20px", weight: 600, lineHeight: "28px" },
  body: { size: "14px", weight: 400, lineHeight: "20px" },
  caption: { size: "12px", weight: 400, lineHeight: "16px" },
} as const;

export const space = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;
export const radius = { sm: 4, md: 8, lg: 12 } as const;
export const shadow = {
  elevation1: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
} as const;
