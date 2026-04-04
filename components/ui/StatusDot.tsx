const STATUS_COLORS = {
  green: "#10b981",
  yellow: "#f59e0b",
  red: "#ef4444",
  gray: "#6b7280",
} as const;

type DotStatus = keyof typeof STATUS_COLORS;

interface StatusDotProps {
  status: DotStatus;
  pulse?: boolean;
}

export function StatusDot({ status, pulse = false }: StatusDotProps) {
  return (
    <span
      className={`inline-block w-2.5 h-2.5 rounded-full ${pulse ? "animate-pulse" : ""}`}
      style={{ backgroundColor: STATUS_COLORS[status] }}
    />
  );
}
