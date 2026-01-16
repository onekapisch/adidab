"use client";

import { useMemo, useState } from "react";
import {
  formatPercent,
  formatUsd,
  type HistorySeriesPoint,
} from "@/lib/market";

type TimeMachinePanelProps = {
  series: HistorySeriesPoint[];
  currentPrice: number | null;
  benchmarkSeries?: HistorySeriesPoint[];
  benchmarkLabel?: string;
};

function findClosestIndex(series: HistorySeriesPoint[], target: number) {
  let left = 0;
  let right = series.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const midValue = series[mid].timestamp;
    if (midValue === target) {
      return mid;
    }
    if (midValue < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  const clamped = Math.min(series.length - 1, Math.max(0, left));
  if (clamped === 0) return clamped;
  const prev = series[clamped - 1];
  const next = series[clamped];
  return Math.abs(prev.timestamp - target) < Math.abs(next.timestamp - target)
    ? clamped - 1
    : clamped;
}

export default function TimeMachinePanel({
  series,
  currentPrice,
  benchmarkSeries,
  benchmarkLabel = "S&P 500",
}: TimeMachinePanelProps) {
  const cleanSeries = useMemo(
    () => series.filter((point) => point.price > 0),
    [series]
  );
  const benchmark = useMemo(
    () => benchmarkSeries?.filter((point) => point.price > 0) ?? [],
    [benchmarkSeries]
  );
  const [investment, setInvestment] = useState(1000);
  const [index, setIndex] = useState(
    cleanSeries.length ? cleanSeries.length - 1 : 0
  );

  const selectedPoint = cleanSeries[index];
  const selectedPrice = selectedPoint?.price ?? null;
  const current = currentPrice ?? cleanSeries[cleanSeries.length - 1]?.price;
  const btcBought =
    selectedPrice && investment ? investment / selectedPrice : null;
  const currentValue =
    btcBought && current ? btcBought * current : null;
  const roi =
    currentValue !== null && investment
      ? ((currentValue - investment) / investment) * 100
      : null;
  const opportunityValue =
    currentValue !== null ? currentValue - investment : null;

  const benchmarkIndex = useMemo(() => {
    if (!benchmark.length || !selectedPoint) return null;
    return findClosestIndex(benchmark, selectedPoint.timestamp);
  }, [benchmark, selectedPoint]);
  const benchmarkSelected = benchmarkIndex !== null ? benchmark[benchmarkIndex] : null;
  const benchmarkCurrent = benchmark.length ? benchmark[benchmark.length - 1].price : null;
  const benchmarkUnits =
    benchmarkSelected?.price && investment
      ? investment / benchmarkSelected.price
      : null;
  const benchmarkValue =
    benchmarkUnits && benchmarkCurrent ? benchmarkUnits * benchmarkCurrent : null;
  const benchmarkRoi =
    benchmarkValue !== null && investment
      ? ((benchmarkValue - investment) / investment) * 100
      : null;

  const projection = useMemo(() => {
    if (!cleanSeries.length || !current) return null;
    const currentTimestamp = cleanSeries[cleanSeries.length - 1].timestamp;
    const fourYearsAgo = currentTimestamp - 1000 * 60 * 60 * 24 * 365 * 4;
    const pastIndex = findClosestIndex(cleanSeries, fourYearsAgo);
    const pastPrice = cleanSeries[pastIndex]?.price;
    if (!pastPrice || pastPrice <= 0) return null;
    const cagr = Math.pow(current / pastPrice, 1 / 4) - 1;
    const twoYearProjection = current * Math.pow(1 + cagr, 2);
    return {
      cagr,
      twoYearProjection,
    };
  }, [cleanSeries, current]);

  const selectedDateLabel = selectedPoint
    ? new Date(selectedPoint.timestamp).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "--";

  const handleDateChange = (value: string) => {
    if (!cleanSeries.length) return;
    const timestamp = new Date(value).getTime();
    if (Number.isNaN(timestamp)) return;
    setIndex(findClosestIndex(cleanSeries, timestamp));
  };

  const handleCopySummary = async () => {
    if (!selectedPoint || currentValue === null || roi === null) return;
    const summaryText = `If you invested $${investment.toFixed(
      0
    )} in BTC on ${selectedDateLabel}, you'd have ${formatUsd(
      currentValue,
      2
    )} today (${formatPercent(roi)}).`;
    try {
      await navigator.clipboard.writeText(summaryText);
    } catch {
      // Silently ignore clipboard failures.
    }
  };

  return (
    <div className="soft-card p-6 gold-glow">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            Time Machine
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-white">
            If you bought Bitcoin on...
          </h3>
        </div>
        <div className="rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-amber-200">
          Historical
        </div>
      </div>

      {cleanSeries.length ? (
        <div className="mt-6 space-y-6">
          <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-white/40">
                Investment USD
              </label>
              <input
                type="number"
                min="10"
                value={investment}
                onChange={(event) => {
                  const value = Number(event.target.value);
                  setInvestment(Number.isFinite(value) ? value : 0);
                }}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-2 text-base text-white focus:border-amber-300 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-white/40">
                Date
              </label>
              <input
                type="date"
                onChange={(event) => handleDateChange(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-2 text-base text-white focus:border-amber-300 focus:outline-none"
              />
            </div>
          </div>

          <input
            type="range"
            min={0}
            max={Math.max(cleanSeries.length - 1, 0)}
            value={index}
            onChange={(event) => setIndex(Number(event.target.value))}
            className="w-full accent-amber-300"
          />

          <div className="grid gap-4 text-sm text-white/60 sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                Selected date
              </p>
              <p className="mt-2 text-base font-semibold text-white">
                {selectedDateLabel}
              </p>
              <p className="mt-1 text-xs text-white/40">
                Price: {selectedPrice ? formatUsd(selectedPrice, 2) : "--"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                Value today
              </p>
              <p className="mt-2 text-base font-semibold text-white">
                {currentValue ? formatUsd(currentValue, 2) : "--"}
              </p>
              <p className="mt-1 text-xs text-white/40">
                BTC held: {btcBought ? btcBought.toFixed(4) : "--"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                ROI
              </p>
              <p className="mt-2 text-base font-semibold text-white">
                {roi !== null ? formatPercent(roi) : "--"}
              </p>
              <p className="mt-1 text-xs text-white/40">
                Current price: {current ? formatUsd(current, 2) : "--"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleCopySummary}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/70 transition hover:border-white/30 hover:text-white"
            >
              Copy Summary
            </button>
            <span className="text-xs uppercase tracking-[0.3em] text-white/40">
              Share-ready
            </span>
          </div>

          <div className="grid gap-4 text-sm text-white/60 sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                Opportunity
              </p>
              <p className="mt-2 text-base font-semibold text-white">
                {opportunityValue !== null
                  ? formatUsd(opportunityValue, 2)
                  : "--"}
              </p>
              <p className="mt-1 text-xs text-white/40">
                Gains since selected date
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                {benchmarkLabel} value
              </p>
              <p className="mt-2 text-base font-semibold text-white">
                {benchmarkValue !== null ? formatUsd(benchmarkValue, 2) : "--"}
              </p>
              <p className="mt-1 text-xs text-white/40">
                ROI: {benchmarkRoi !== null ? formatPercent(benchmarkRoi) : "--"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                Cycle projection
              </p>
              <p className="mt-2 text-base font-semibold text-white">
                {projection?.twoYearProjection
                  ? formatUsd(projection.twoYearProjection, 0)
                  : "--"}
              </p>
              <p className="mt-1 text-xs text-white/40">
                Based on 4y CAGR {projection?.cagr ? formatPercent(projection.cagr * 100) : "--"}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-white/10 bg-black/40 px-4 py-6 text-sm text-white/50">
          Historical data is unavailable right now. Please check back soon.
        </div>
      )}
    </div>
  );
}
