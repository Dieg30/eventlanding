'use client';

import { useState, useEffect } from 'react';

interface Props {
  deadline: string; // ISO 8601 con offset, ej. '2026-07-23T19:00:00-05:00'
  className?: string;
}

export default function EarlyBirdCountdown({ deadline, className = '' }: Props) {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    const target = new Date(deadline).getTime();
    const tick = () => setTimeLeft(Math.max(0, target - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [deadline]);

  if (timeLeft === null || timeLeft <= 0) return null;

  const h = Math.floor(timeLeft / 3_600_000);
  const m = Math.floor((timeLeft % 3_600_000) / 60_000);
  const s = Math.floor((timeLeft % 60_000) / 1_000);

  const formatted =
    h > 0
      ? `${h}h ${String(m).padStart(2, '0')}m`
      : m > 0
        ? `${m}m ${String(s).padStart(2, '0')}s`
        : `${s}s`;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
      <span className="text-amber-600/90 text-[10px] uppercase tracking-[0.4em]">
        Últimas preventas · precio sube en {formatted}
      </span>
    </div>
  );
}
