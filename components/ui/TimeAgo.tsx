"use client";

import { useEffect, useState } from "react";
import { timeAgo } from "@/lib/timeUtils";

interface TimeAgoProps {
  date: string;
  className?: string;
}

export function TimeAgo({ date, className = "" }: TimeAgoProps) {
  const [display, setDisplay] = useState(timeAgo(date));

  useEffect(() => {
    const interval = setInterval(() => setDisplay(timeAgo(date)), 15000);
    return () => clearInterval(interval);
  }, [date]);

  return (
    <span className={`font-mono text-xs ${className}`} style={{ color: "var(--text-muted)" }}>
      {display}
    </span>
  );
}
