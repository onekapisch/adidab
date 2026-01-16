"use client";

import { useEffect, useState } from "react";
import { formatPercent, formatUsd } from "@/lib/market";

type Summary = {
  price: number | null;
  change24h: number | null;
  updatedAt: string | null;
};

const initialSummary: Summary = {
  price: null,
  change24h: null,
  updatedAt: null,
};

export default function LivePrice() {
  const [summary, setSummary] = useState<Summary>(initialSummary);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const response = await fetch("/api/market");
        if (!response.ok) return;
        const data = (await response.json()) as { summary?: Summary };
        if (active && data.summary) {
          setSummary({
            price: data.summary.price ?? null,
            change24h: data.summary.change24h ?? null,
            updatedAt: data.summary.updatedAt ?? null,
          });
        }
      } catch {
        // Ignore network errors and keep last known value.
      }
    };

    load();
    const interval = setInterval(load, 60_000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const priceText = summary.price ? formatUsd(summary.price, 2) : "--";
  const changeText =
    summary.change24h !== null ? formatPercent(summary.change24h) : "--";
  const changeClass =
    summary.change24h !== null && summary.change24h >= 0
      ? "text-emerald-300"
      : "text-rose-300";

  return (
    <div
      className="hidden items-center gap-3 rounded-full border border-amber-300/20 bg-black/50 px-4 py-2 text-xs uppercase tracking-[0.25em] text-white/80 shadow-premium lg:flex"
      aria-live="polite"
    >
      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
      <span className="text-white/60">BTC</span>
      <span className="text-sm font-semibold text-white">{priceText}</span>
      <span className={`text-xs font-semibold ${changeClass}`}>
        {changeText}
      </span>
    </div>
  );
}
