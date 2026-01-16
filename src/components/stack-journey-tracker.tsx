"use client";

import { useEffect, useMemo, useState } from "react";
import { formatNumber, formatUsd } from "@/lib/market";

type StackJourneyTrackerProps = {
  price: number | null;
};

type JourneyState = {
  goalBtc: number;
  currentBtc: number;
  monthlyDca: number;
};

const STORAGE_KEY = "adidab:journey";

const defaultState: JourneyState = {
  goalBtc: 0.1,
  currentBtc: 0.01,
  monthlyDca: 200,
};

function parseStoredState(raw: string | null): JourneyState {
  if (!raw) return defaultState;
  try {
    const data = JSON.parse(raw) as Partial<JourneyState>;
    return {
      goalBtc: Number.isFinite(data.goalBtc) ? Number(data.goalBtc) : 0.1,
      currentBtc: Number.isFinite(data.currentBtc) ? Number(data.currentBtc) : 0.01,
      monthlyDca: Number.isFinite(data.monthlyDca) ? Number(data.monthlyDca) : 200,
    };
  } catch {
    return defaultState;
  }
}

export default function StackJourneyTracker({ price }: StackJourneyTrackerProps) {
  const [state, setState] = useState<JourneyState>(() =>
    typeof window === "undefined"
      ? defaultState
      : parseStoredState(localStorage.getItem(STORAGE_KEY))
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const progress = useMemo(() => {
    if (!state.goalBtc || state.goalBtc <= 0) return 0;
    return Math.min(1, state.currentBtc / state.goalBtc);
  }, [state.currentBtc, state.goalBtc]);

  const remainingBtc = Math.max(state.goalBtc - state.currentBtc, 0);
  const monthsToGoal =
    price && state.monthlyDca > 0
      ? Math.ceil((remainingBtc * price) / state.monthlyDca)
      : null;

  const milestone = useMemo(() => {
    const milestones = [0.25, 0.5, 0.75, 1];
    return milestones.find((value) => value > progress) ?? 1;
  }, [progress]);

  const milestoneLabel = milestone === 1 ? "Full stack" : `${milestone * 100}%`;

  return (
    <div className="glass-card gold-glow p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            Stack Journey
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-white">
            Track your Bitcoin goal.
          </h3>
        </div>
        <div className="rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-amber-200">
          Personal
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/40">
            <span>Progress</span>
            <span>{Math.round(progress * 100)}%</span>
          </div>
          <div className="mt-3 h-3 w-full rounded-full bg-white/10">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500 shadow-premium"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
          <p className="mt-3 text-xs uppercase tracking-[0.3em] text-white/50">
            Next milestone: {milestoneLabel}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="text-xs uppercase tracking-[0.3em] text-white/40">
              Goal BTC
            </label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={state.goalBtc}
              onChange={(event) =>
                setState((prev) => ({
                  ...prev,
                  goalBtc: Number(event.target.value) || 0,
                }))
              }
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-2 text-base text-white focus:border-amber-300 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.3em] text-white/40">
              Current BTC
            </label>
            <input
              type="number"
              min="0"
              step="0.0001"
              value={state.currentBtc}
              onChange={(event) =>
                setState((prev) => ({
                  ...prev,
                  currentBtc: Number(event.target.value) || 0,
                }))
              }
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-2 text-base text-white focus:border-amber-300 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.3em] text-white/40">
              Monthly DCA (USD)
            </label>
            <input
              type="number"
              min="0"
              step="10"
              value={state.monthlyDca}
              onChange={(event) =>
                setState((prev) => ({
                  ...prev,
                  monthlyDca: Number(event.target.value) || 0,
                }))
              }
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-2 text-base text-white focus:border-amber-300 focus:outline-none"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
          {price ? (
            <>
              Remaining: {formatNumber(remainingBtc)} BTC. At{" "}
              {formatUsd(state.monthlyDca, 0)} per month, you could reach your
              goal in {monthsToGoal ?? "--"} months.
            </>
          ) : (
            "Set your goal and DCA pace to see an estimated timeline."
          )}
        </div>
      </div>
    </div>
  );
}
