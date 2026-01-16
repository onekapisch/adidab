"use client";

import { useEffect, useMemo, useState } from "react";
import { formatPercent, formatUsd, type MarketSummary } from "@/lib/market";

type PortfolioTrackerProps = {
  initialSummary: MarketSummary;
};

const STORAGE_KEY = "adidab-portfolio";

type PortfolioState = {
  btcAmount: number;
  costBasis: number;
};

export default function PortfolioTracker({
  initialSummary,
}: PortfolioTrackerProps) {
  const [summary, setSummary] = useState<MarketSummary>(initialSummary);
  const [portfolio, setPortfolio] = useState<PortfolioState>(() => {
    if (typeof window === "undefined") {
      return { btcAmount: 0.1, costBasis: 0 };
    }
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return { btcAmount: 0.1, costBasis: 0 };
    }
    try {
      return JSON.parse(stored) as PortfolioState;
    } catch {
      return { btcAmount: 0.1, costBasis: 0 };
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolio));
  }, [portfolio]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const response = await fetch("/api/market");
        if (!response.ok) return;
        const data = (await response.json()) as { summary?: MarketSummary };
        if (!active) return;
        if (data.summary) {
          setSummary(data.summary);
        }
      } catch {
        // Ignore network errors.
      }
    };

    load();
    const interval = setInterval(load, 60_000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const currentValue = useMemo(() => {
    if (!summary.price) return null;
    return portfolio.btcAmount * summary.price;
  }, [portfolio.btcAmount, summary.price]);

  const profitLoss = useMemo(() => {
    if (currentValue === null) return null;
    return currentValue - portfolio.costBasis;
  }, [currentValue, portfolio.costBasis]);

  const profitPercent = useMemo(() => {
    if (!portfolio.costBasis || profitLoss === null) return null;
    return (profitLoss / portfolio.costBasis) * 100;
  }, [portfolio.costBasis, profitLoss]);

  return (
    <div className="soft-card p-6 gold-glow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            Portfolio Snapshot
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-white">
            Keep your holdings in view.
          </h3>
        </div>
        <div className="rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-amber-200">
          Local
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div>
          <label className="text-xs uppercase tracking-[0.3em] text-white/40">
            Total BTC
          </label>
          <input
            type="number"
            min="0"
            step="0.0001"
            value={portfolio.btcAmount}
            onChange={(event) => {
              const value = Number(event.target.value);
              setPortfolio((prev) => ({
                ...prev,
                btcAmount: Number.isFinite(value) ? value : 0,
              }));
            }}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-2 text-base text-white focus:border-amber-300 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.3em] text-white/40">
            Cost basis (USD)
          </label>
          <input
            type="number"
            min="0"
            value={portfolio.costBasis}
            onChange={(event) => {
              const value = Number(event.target.value);
              setPortfolio((prev) => ({
                ...prev,
                costBasis: Number.isFinite(value) ? value : 0,
              }));
            }}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-2 text-base text-white focus:border-amber-300 focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-5 grid gap-4 text-sm text-white/60 sm:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">
            Current value
          </p>
          <p className="mt-2 text-base font-semibold text-white">
            {currentValue !== null ? formatUsd(currentValue, 2) : "--"}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">
            P/L
          </p>
          <p className="mt-2 text-base font-semibold text-white">
            {profitLoss !== null ? formatUsd(profitLoss, 2) : "--"}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">
            P/L %
          </p>
          <p className="mt-2 text-base font-semibold text-white">
            {profitPercent !== null ? formatPercent(profitPercent) : "--"}
          </p>
        </div>
      </div>
      <p className="mt-3 text-xs text-white/40">
        Stored locally on this device. We do not collect your holdings.
      </p>
    </div>
  );
}
