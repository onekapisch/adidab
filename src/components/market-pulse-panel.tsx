"use client";

import { useEffect, useMemo, useState } from "react";
import Sparkline from "@/components/sparkline";
import {
  formatCompact,
  formatPercent,
  formatUsd,
  type HistoryData,
  type MarketSummary,
} from "@/lib/market";

type MarketPulsePanelProps = {
  initialSummary: MarketSummary;
  initialChart: number[];
  size?: "default" | "large";
};

type MarketResponse = {
  summary?: MarketSummary;
  chart?: number[];
};

type HistoryResponse = {
  history?: HistoryData;
};

type RangeKey = "1M" | "6M" | "1Y" | "YTD" | "MAX";

type RangeStats = {
  start: number | null;
  end: number | null;
  low: number | null;
  high: number | null;
  change: number | null;
};

const rangeOptions: { key: RangeKey; label: string }[] = [
  { key: "1M", label: "1M" },
  { key: "6M", label: "6M" },
  { key: "1Y", label: "1Y" },
  { key: "YTD", label: "YTD" },
  { key: "MAX", label: "MAX" },
];

const rangeTitles: Record<RangeKey, string> = {
  "1M": "30-Day Bitcoin Trend",
  "6M": "6-Month Bitcoin Trend",
  "1Y": "1-Year Bitcoin Trend",
  YTD: "Year-to-Date Bitcoin Trend",
  MAX: "Bitcoin Trend Since Inception",
};

function getYtdDays() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - start.getTime();
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function getRangeDays(range: RangeKey) {
  switch (range) {
    case "6M":
      return 180;
    case "1Y":
      return 365;
    case "YTD":
      return getYtdDays();
    case "1M":
    default:
      return 30;
  }
}

function buildRangeStats(prices: number[]): RangeStats {
  if (!prices.length) {
    return {
      start: null,
      end: null,
      low: null,
      high: null,
      change: null,
    };
  }
  const start = prices[0];
  const end = prices[prices.length - 1];
  const low = Math.min(...prices);
  const high = Math.max(...prices);
  const change = start ? ((end - start) / start) * 100 : null;

  return { start, end, low, high, change };
}

export default function MarketPulsePanel({
  initialSummary,
  initialChart,
  size = "default",
}: MarketPulsePanelProps) {
  const [summary, setSummary] = useState<MarketSummary>(initialSummary);
  const [chart, setChart] = useState<number[]>(initialChart);
  const [isLive, setIsLive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [range, setRange] = useState<RangeKey>("1M");
  const [historyStats, setHistoryStats] = useState<HistoryData["stats"] | null>(
    null
  );
  const [lastUpdated, setLastUpdated] = useState<string>(
    initialSummary.updatedAt
  );

  useEffect(() => {
    let active = true;

    const load = async () => {
      if (!active) {
        return;
      }
      setIsLoading(true);
      try {
        if (range === "MAX") {
          const [marketResponse, historyResponse] = await Promise.all([
            fetch("/api/market?days=30"),
            fetch("/api/history"),
          ]);

          if (!marketResponse.ok || !historyResponse.ok) {
            throw new Error("Failed to load market data");
          }

          const marketData = (await marketResponse.json()) as MarketResponse;
          const historyData = (await historyResponse.json()) as HistoryResponse;

          if (!active) {
            return;
          }

          if (marketData.summary) {
            setSummary(marketData.summary);
            setLastUpdated(
              marketData.summary.updatedAt ?? new Date().toISOString()
            );
          }

          if (historyData.history?.prices?.length) {
            setChart(historyData.history.prices);
          }

          setHistoryStats(historyData.history?.stats ?? null);
        } else {
          const days = getRangeDays(range);
          const response = await fetch(`/api/market?days=${days}`);
          if (!response.ok) {
            throw new Error("Failed to load market data");
          }
          const data = (await response.json()) as MarketResponse;
          if (!active) {
            return;
          }
          if (data.summary) {
            setSummary(data.summary);
            setLastUpdated(data.summary.updatedAt ?? new Date().toISOString());
          }
          if (data.chart?.length) {
            setChart(data.chart);
          }
          setHistoryStats(null);
        }

        setIsLive(true);
      } catch {
        if (!active) {
          return;
        }
        setIsLive(false);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    load();
    const interval = setInterval(load, 60_000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [range]);

  const priceText = summary.price ? formatUsd(summary.price, 2) : "--";
  const marketCapText = summary.marketCap
    ? `$${formatCompact(summary.marketCap)}`
    : "--";
  const volumeText = summary.volume24h
    ? `$${formatCompact(summary.volume24h)}`
    : "--";
  const dominanceText = summary.dominance
    ? `${summary.dominance.toFixed(1)}%`
    : "--";
  const changeText =
    summary.change24h !== null ? formatPercent(summary.change24h) : "--";
  const rangeStats = useMemo(() => {
    if (range === "MAX" && historyStats) {
      const change = historyStats.start
        ? ((historyStats.end - historyStats.start) / historyStats.start) * 100
        : null;
      return { ...historyStats, change };
    }

    return buildRangeStats(chart);
  }, [chart, historyStats, range]);
  const rangeStartText = rangeStats.start ? formatUsd(rangeStats.start, 2) : "--";
  const rangeEndText = rangeStats.end ? formatUsd(rangeStats.end, 2) : "--";
  const rangeLowText = rangeStats.low ? formatUsd(rangeStats.low, 2) : "--";
  const rangeHighText = rangeStats.high ? formatUsd(rangeStats.high, 2) : "--";
  const rangeChangeText =
    rangeStats.change !== null ? formatPercent(rangeStats.change) : "--";
  const rangeChangeClass =
    rangeStats.change === null
      ? "text-white"
      : rangeStats.change >= 0
      ? "text-emerald-300"
      : "text-rose-300";
  const lastUpdatedLabel = useMemo(() => {
    if (!lastUpdated) return "--";
    return new Date(lastUpdated).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  }, [lastUpdated]);

  const isLarge = size === "large";
  const title = rangeTitles[range];

  return (
    <div className={`glass-card gold-glow ${isLarge ? "p-8 lg:p-10" : "p-6 lg:p-8"}`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            Market Pulse
          </p>
          <p className={`mt-2 font-semibold text-white ${isLarge ? "text-3xl" : "text-2xl"}`}>
            {title}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-amber-200">
            {isLoading ? "Updating" : isLive ? "Live" : "Offline"}
          </div>
          <div className="flex items-center gap-2 rounded-full border border-amber-300/20 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-[0.3em] text-white/60 backdrop-blur">
            {rangeOptions.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setRange(option.key)}
                className={`rounded-full px-3 py-1 text-[10px] font-semibold tracking-[0.25em] transition ${
                  range === option.key
                    ? "bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500 text-black shadow-premium"
                    : "text-white/60 hover:text-white"
                }`}
                aria-pressed={range === option.key}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/50">
        <span>{priceText}</span>
        <span className="text-amber-300">{changeText}</span>
      </div>
      <div className="mt-4">
        {chart.length ? (
          <Sparkline
            data={chart}
            height={isLarge ? 220 : 120}
            className={isLarge ? "h-56" : "h-32"}
          />
        ) : (
          <div
            className={`flex items-center justify-center rounded-2xl border border-white/10 bg-black/40 text-sm text-white/50 ${
              isLarge ? "h-56" : "h-32"
            }`}
          >
            Market data unavailable.
          </div>
        )}
      </div>
      <div className={`mt-6 grid gap-4 ${isLarge ? "sm:grid-cols-4" : "sm:grid-cols-3"}`}>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">
            Market Cap
          </p>
          <p className="mt-2 text-lg font-semibold text-white">
            {marketCapText}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">
            24h Volume
          </p>
          <p className="mt-2 text-lg font-semibold text-white">
            {volumeText}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">
            BTC Dominance
          </p>
          <p className="mt-2 text-lg font-semibold text-white">
            {dominanceText}
          </p>
        </div>
        {isLarge ? (
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">
              Data Status
            </p>
            <p className="mt-2 text-lg font-semibold text-white">
            {isLive ? "Live feed" : "Cached"}
          </p>
        </div>
        ) : null}
      </div>
      {isLarge ? (
        <>
          <p className="mt-6 text-xs uppercase tracking-[0.3em] text-white/40">
            Range Snapshot
          </p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                Range Start
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {rangeStartText}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                Range End
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {rangeEndText}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                Range Low
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {rangeLowText}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                Range High
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {rangeHighText}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                Range Change
              </p>
              <p className={`mt-2 text-lg font-semibold ${rangeChangeClass}`}>
                {rangeChangeText}
              </p>
            </div>
          </div>
        </>
      ) : null}
      <p className="mt-4 text-xs text-white/40">
        Updated {lastUpdatedLabel} local time. Data via CoinGecko.
      </p>
    </div>
  );
}
