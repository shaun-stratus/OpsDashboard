"use client";

interface RefreshButtonProps {
  onClick: () => void;
  loading?: boolean;
}

export function RefreshButton({ onClick, loading = false }: RefreshButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`text-xs px-2 py-1 rounded border transition-colors ${loading ? "animate-spin" : ""}`}
      style={{
        borderColor: "var(--border-panel)",
        color: "var(--text-muted)",
      }}
    >
      ↻
    </button>
  );
}
