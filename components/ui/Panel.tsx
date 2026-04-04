import { COLORS, AccentColor } from "@/lib/colors";

interface PanelProps {
  title: string;
  accent: AccentColor;
  children: React.ReactNode;
  className?: string;
  span?: number;
}

export function Panel({ title, accent, children, className = "", span = 1 }: PanelProps) {
  const colSpan = span > 1 ? `col-span-${span}` : "";

  return (
    <div
      className={`rounded-lg border overflow-hidden ${colSpan} ${className}`}
      style={{
        backgroundColor: "var(--bg-panel)",
        borderColor: "var(--border-panel)",
      }}
    >
      <div
        className="px-3 py-2 text-xs font-semibold uppercase tracking-wider flex items-center gap-2"
        style={{ borderBottom: `2px solid ${COLORS[accent]}`, color: COLORS[accent] }}
      >
        <span
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: COLORS[accent] }}
        />
        {title}
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}
