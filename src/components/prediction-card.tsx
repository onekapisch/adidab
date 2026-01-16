"use client";

import { useEffect, useMemo, useState } from "react";
import { formatPercent, formatUsd } from "@/lib/market";
import {
  createPrediction,
  defaultPredictionState,
  loadPredictionState,
  resolvePrediction,
  savePredictionState,
  type PredictionDirection,
  type PredictionHistoryItem,
  type PredictionState,
} from "@/lib/prediction";

type PredictionCardProps = {
  currentPrice: number | null;
};

function formatCountdown(ms: number) {
  if (ms <= 0) return "Ready";
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
}

export default function PredictionCard({ currentPrice }: PredictionCardProps) {
  const [state, setState] = useState<PredictionState>(() => {
    if (typeof window === "undefined") return defaultPredictionState;
    const loaded = loadPredictionState();
    return currentPrice
      ? resolvePrediction(loaded, currentPrice, Date.now())
      : loaded;
  });
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    savePredictionState(state);
  }, [state]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
      if (!currentPrice) return;
      setState((prev) => resolvePrediction(prev, currentPrice, Date.now()));
    }, 60_000);
    return () => clearInterval(interval);
  }, [currentPrice]);

  const recordTotal = state.stats.wins + state.stats.losses;
  const winRate = recordTotal
    ? Math.round((state.stats.wins / recordTotal) * 100)
    : 0;

  const handlePrediction = (direction: PredictionDirection) => {
    if (!currentPrice || state.currentPrediction) return;
    setState((prev) => createPrediction(prev, direction, currentPrice));
  };

  const lastResult: PredictionHistoryItem | null =
    !state.currentPrediction && state.history.length
      ? state.history[0]
      : null;

  const active = state.currentPrediction;
  const timeRemaining = active ? active.resolveAt - now : 0;
  const priceText = currentPrice ? formatUsd(currentPrice, 2) : "--";
  const startText = active
    ? formatUsd(active.priceAtPrediction, 2)
    : lastResult
    ? formatUsd(lastResult.priceStart, 2)
    : "--";
  const endText = lastResult
    ? formatUsd(lastResult.priceEnd, 2)
    : currentPrice
    ? formatUsd(currentPrice, 2)
    : "--";
  const currentDelta =
    active && currentPrice
      ? ((currentPrice - active.priceAtPrediction) / active.priceAtPrediction) *
        100
      : null;
  const deltaText =
    currentDelta !== null ? formatPercent(currentDelta) : "--";

  const statusCopy = useMemo(() => {
    if (!active && !lastResult) return "Make your first prediction.";
    if (active && currentDelta !== null) {
      return currentDelta >= 0 ? "Looking good so far." : "Volatility check.";
    }
    if (lastResult) {
      return lastResult.result === "win"
        ? "You were right."
        : "Close call. Try again.";
    }
    return "--";
  }, [active, currentDelta, lastResult]);

  return (
    <div className="glass-card gold-glow p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg" role="img" aria-label="Prediction">
            🎯
          </span>
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            Daily Prediction
          </p>
        </div>
        <div className="rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-amber-200">
          24h
        </div>
      </div>

      {!active && !lastResult ? (
        <div className="mt-6 space-y-4">
          <p className="text-lg font-semibold text-white">
            Will BTC be higher or lower in 24 hours?
          </p>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
            Current: <span className="text-white">{priceText}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handlePrediction("higher")}
              className="flex-1 rounded-full bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-black shadow-premium transition hover:opacity-90"
              disabled={!currentPrice}
            >
              ▲ Higher
            </button>
            <button
              type="button"
              onClick={() => handlePrediction("lower")}
              className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/70 transition hover:border-white/30 hover:text-white"
              disabled={!currentPrice}
            >
              ▼ Lower
            </button>
          </div>
        </div>
      ) : active ? (
        <div className="mt-6 space-y-4">
          <p className="text-lg font-semibold text-white">
            Prediction locked: {active.direction === "higher" ? "▲ Higher" : "▼ Lower"}
          </p>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
            Start: <span className="text-white">{startText}</span>
          </div>
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/50">
            <span>Result in</span>
            <span className="text-white">{formatCountdown(timeRemaining)}</span>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
            Current: <span className="text-white">{priceText}</span>{" "}
            <span className="text-white/50">({deltaText})</span>
          </div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">
            {statusCopy}
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          <p className="text-lg font-semibold text-white">Result</p>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
            {lastResult?.result === "win" ? "✅ You were right!" : "❌ Missed it."}
          </div>
          <div className="text-sm text-white/60">
            Predicted {lastResult?.prediction === "higher" ? "▲ Higher" : "▼ Lower"}.
            Start {startText} → End {endText}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handlePrediction("higher")}
              className="flex-1 rounded-full bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-black shadow-premium transition hover:opacity-90"
              disabled={!currentPrice}
            >
              ▲ Higher
            </button>
            <button
              type="button"
              onClick={() => handlePrediction("lower")}
              className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/70 transition hover:border-white/30 hover:text-white"
              disabled={!currentPrice}
            >
              ▼ Lower
            </button>
          </div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">
            {statusCopy}
          </p>
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.3em] text-white/50">
        <span>
          Record: {state.stats.wins}-{state.stats.losses} ({winRate}%)
        </span>
        <span>🔥 Streak: {state.stats.currentStreak}</span>
        <span>Best: {state.stats.bestStreak}</span>
      </div>
    </div>
  );
}
