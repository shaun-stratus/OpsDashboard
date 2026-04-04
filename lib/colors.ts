export const COLORS = {
  supabase: "#10b981",
  n8n: "#3b82f6",
  notion: "#f59e0b",
  git: "#8b5cf6",
  error: "#ef4444",
  neutral: "#6b7280",
} as const;

export type AccentColor = keyof typeof COLORS;
