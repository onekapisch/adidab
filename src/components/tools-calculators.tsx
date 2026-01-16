"use client";

import { useMemo, useState } from "react";
import { formatNumber, formatUsd } from "@/lib/market";

type ToolsCalculatorsProps = {
  price: number | null;
};

export default function ToolsCalculators({ price }: ToolsCalculatorsProps) {
  const [usdAmount, setUsdAmount] = useState(100);
  const [weeklyAmount, setWeeklyAmount] = useState(50);
  const [weeks, setWeeks] = useState(26);

  const effectivePrice = price ?? 100_000;

  const satsValue = useMemo(() => {
    if (effectivePrice <= 0) return 0;
    return Math.floor((usdAmount / effectivePrice) * 100_000_000);
  }, [usdAmount, effectivePrice]);

  const totalInvested = weeklyAmount * weeks;
  const estimatedBtc = effectivePrice > 0 ? totalInvested / effectivePrice : 0;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="soft-card p-6 gold-glow">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">
          Sats per Dollar
        </p>
        <h3 className="mt-3 text-2xl font-semibold text-white">
          Convert USD to sats.
        </h3>
        <div className="mt-6 space-y-4">
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-white/40">
              USD Amount
            </label>
            <input
              type="number"
              min="1"
              value={usdAmount}
              onChange={(event) => {
                const value = Number(event.target.value);
                setUsdAmount(Number.isFinite(value) ? value : 0);
              }}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-2 text-base text-white focus:border-amber-300 focus:outline-none"
            />
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">
              Estimated Sats
            </p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {formatNumber(satsValue)}
            </p>
            <p className="mt-1 text-xs text-white/40">
              {price
                ? `Based on ${formatUsd(effectivePrice, 2)} per BTC.`
                : "Live price unavailable. Using a placeholder price."}
            </p>
          </div>
        </div>
      </div>

      <div className="soft-card p-6 gold-glow">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">
          DCA Planner
        </p>
        <h3 className="mt-3 text-2xl font-semibold text-white">
          Preview your steady stack.
        </h3>
        <div className="mt-6 grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-white/40">
                Weekly USD
              </label>
              <input
              type="number"
              min="1"
              value={weeklyAmount}
              onChange={(event) => {
                const value = Number(event.target.value);
                setWeeklyAmount(Number.isFinite(value) ? value : 0);
              }}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-2 text-base text-white focus:border-amber-300 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-white/40">
                Weeks
              </label>
              <input
              type="number"
              min="1"
              value={weeks}
              onChange={(event) => {
                const value = Number(event.target.value);
                setWeeks(Number.isFinite(value) ? value : 0);
              }}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-2 text-base text-white focus:border-amber-300 focus:outline-none"
              />
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">
              Estimated Total
            </p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {formatUsd(totalInvested, 2)}
            </p>
            <p className="mt-1 text-xs text-white/40">
              Estimated BTC: {estimatedBtc.toFixed(4)} BTC
            </p>
          </div>
          <p className="text-xs text-white/40">
            Estimates use current price and ignore fees. Ideal for a quick
            daily check.
          </p>
        </div>
      </div>
    </div>
  );
}
