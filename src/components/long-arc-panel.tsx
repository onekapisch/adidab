"use client";

import { useEffect, useMemo, useState } from "react";
import Sparkline from "@/components/sparkline";
import { formatUsd, type HistoryData } from "@/lib/market";

type LongArcPanelProps = {
  initialHistory: HistoryData;
};

type HistoryResponse = {
  history?: HistoryData;
};

export default function LongArcPanel({ initialHistory }: LongArcPanelProps) {
  const [history, setHistory] = useState<HistoryData>(initialHistory);
  const [isLive, setIsLive] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>(
    initialHistory.updatedAt
  );

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const response = await fetch("/api/history");
        if (!response.ok) {
          throw new Error("Failed to load history");
        }
        const data = (await response.json()) as HistoryResponse;
        if (!active) return;
        if (data.history) {
          setHistory(data.history);
          setLastUpdated(data.history.updatedAt ?? new Date().toISOString());
        }
        setIsLive(true);
      } catch {
        if (!active) return;
        setIsLive(false);
      }
    };

    load();
    const interval = setInterval(load, 60 * 60 * 1000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const stats = history.stats;
  const historyStart = stats ? formatUsd(stats.start, 4) : "--";
  const historyEnd = stats ? formatUsd(stats.end, 2) : "--";
  const historyLow = stats ? formatUsd(stats.low, 2) : "--";
  const historyHigh = stats ? formatUsd(stats.high, 2) : "--";
  const lastUpdatedLabel = useMemo(() => {
    if (!lastUpdated) return "--";
    return new Date(lastUpdated).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, [lastUpdated]);

  return (
    <div className="glass-card p-8 gold-glow">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            Long Arc
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-white">
            Bitcoin price from inception to today.
          </h2>
        </div>
        <div className="rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-amber-200">
          {isLive ? "Inception view" : "Waiting on data"}
        </div>
      </div>
      <div className="mt-6">
        {history.prices.length ? (
          <Sparkline data={history.prices} height={220} className="h-56" />
        ) : (
          <div className="flex h-56 items-center justify-center rounded-3xl border border-white/10 bg-black/40 text-sm text-white/50">
            Historical data unavailable. Check again soon.
          </div>
        )}
      </div>
      <div className="mt-6 grid gap-4 text-sm text-white/60 sm:grid-cols-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">
            Starting price
          </p>
          <p className="mt-2 text-base font-semibold text-white">
            {historyStart}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">
            Current price
          </p>
          <p className="mt-2 text-base font-semibold text-white">
            {historyEnd}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">
            All-time low
          </p>
          <p className="mt-2 text-base font-semibold text-white">
            {historyLow}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">
            All-time high
          </p>
          <p className="mt-2 text-base font-semibold text-white">
            {historyHigh}
          </p>
        </div>
      </div>
      <p className="mt-4 text-xs text-white/40">
        Updated {lastUpdatedLabel}. Data via Blockchain.com, downsampled for
        performance.
      </p>
    </div>
  );
}
