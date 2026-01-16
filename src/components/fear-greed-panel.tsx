"use client";

import { useEffect, useMemo, useState } from "react";
import Sparkline from "@/components/sparkline";
import type { FearGreedData } from "@/lib/fear-greed";

type FearGreedPanelProps = {
  initialData: FearGreedData;
  size?: "default" | "large";
};

type FearGreedResponse = {
  sentiment?: FearGreedData;
};

function clampValue(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

export default function FearGreedPanel({
  initialData,
  size = "default",
}: FearGreedPanelProps) {
  const [data, setData] = useState<FearGreedData>(initialData);
  const [isLive, setIsLive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let active = true;

    const load = async () => {
      if (!active) return;
      setIsLoading(true);
      try {
        const response = await fetch("/api/fear-greed");
        if (!response.ok) {
          throw new Error("Failed to load sentiment");
        }
        const payload = (await response.json()) as FearGreedResponse;
        if (!active) return;
        if (payload.sentiment) {
          setData(payload.sentiment);
        }
        setIsLive(true);
      } catch {
        if (!active) return;
        setIsLive(false);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    load();
    const interval = setInterval(load, 3_600_000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const value = data.value ?? 0;
  const score = clampValue(value);
  const label = data.classification ?? "Neutral";
  const historySeries = useMemo(
    () => data.history.map((point) => point.value),
    [data.history]
  );
  const isLarge = size === "large";
  const updatedLabel = data.updatedAt
    ? new Date(data.updatedAt).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })
    : "--";

  return (
    <div className={`glass-card gold-glow ${isLarge ? "p-8 lg:p-10" : "p-6 lg:p-8"}`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            Market Sentiment
          </p>
          <p className={`mt-2 font-semibold text-white ${isLarge ? "text-3xl" : "text-2xl"}`}>
            Fear &amp; Greed Index
          </p>
        </div>
        <div className="rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-amber-200">
          {isLoading ? "Updating" : isLive ? "Live" : "Offline"}
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-4xl font-semibold text-white">{score}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.3em] text-white/50">
              {label}
            </p>
          </div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            0 = Fear / 100 = Greed
          </p>
        </div>
        <div className="relative mt-4 h-3 w-full rounded-full bg-gradient-to-r from-rose-400 via-amber-300 to-emerald-300">
          <span
            className="absolute -top-2 h-7 w-7 -translate-x-1/2 rounded-full border border-white/20 bg-black/80 shadow-premium"
            style={{ left: `${score}%` }}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="text-sm text-white/60">
          <p>
            Sentiment gives newcomers a quick signal on market mood. When fear is
            high, daily checkers usually move cautiously and focus on learning.
          </p>
          <p className="mt-3 text-xs uppercase tracking-[0.3em] text-white/50">
            Updated {updatedLabel} local time
          </p>
        </div>
        <div>
          {historySeries.length ? (
            <Sparkline
              data={historySeries}
              height={isLarge ? 120 : 90}
              className={isLarge ? "h-28" : "h-24"}
            />
          ) : (
            <div className="flex h-24 items-center justify-center rounded-2xl border border-white/10 bg-black/40 text-xs text-white/50">
              Sentiment history unavailable.
            </div>
          )}
          <p className="mt-2 text-xs uppercase tracking-[0.3em] text-white/40">
            30-day trend
          </p>
        </div>
      </div>
    </div>
  );
}
