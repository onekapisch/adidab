"use client";

import { useEffect, useMemo, useState } from "react";
import { formatCurrency, formatPercent, type MarketSummary } from "@/lib/market";

type LivePriceTileProps = {
  initialSummary: MarketSummary;
};

type MarketResponse = {
  summary?: MarketSummary;
};

const currencyOptions = [
  { key: "usd", label: "$", currency: "USD" },
  { key: "eur", label: "€", currency: "EUR" },
] as const;

export default function LivePriceTile({ initialSummary }: LivePriceTileProps) {
  const [currency, setCurrency] = useState<"usd" | "eur">("usd");
  const [summary, setSummary] = useState<MarketSummary>(initialSummary);
  const [isLive, setIsLive] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(initialSummary.updatedAt);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const response = await fetch(`/api/market?currency=${currency}&days=30`);
        if (!response.ok) {
          throw new Error("Failed to load price");
        }
        const data = (await response.json()) as MarketResponse;
        if (!active) return;
        if (data.summary) {
          setSummary(data.summary);
          setLastUpdated(data.summary.updatedAt ?? new Date().toISOString());
        }
        setIsLive(true);
      } catch {
        if (!active) return;
        setIsLive(false);
      }
    };

    load();
    const interval = setInterval(load, 60_000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [currency]);

  const activeCurrency = currencyOptions.find((option) => option.key === currency);
  const priceText = summary.price
    ? formatCurrency(summary.price, activeCurrency?.currency || "USD", 2)
    : "--";

  const changeText =
    summary.change24h !== null ? formatPercent(summary.change24h) : "--";
  const changeClass =
    summary.change24h !== null && summary.change24h >= 0
      ? "text-emerald-300"
      : "text-rose-300";
  const updatedLabel = useMemo(() => {
    if (!lastUpdated) return "--";
    return new Date(lastUpdated).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  }, [lastUpdated]);

  return (
    <div className="glass-card gold-glow p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/50">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          Live Price
        </div>
        <div className="liquid-toggle flex items-center gap-2 px-2 py-1 text-[10px] uppercase tracking-[0.3em] text-amber-200">
          {currencyOptions.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setCurrency(option.key)}
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                currency === option.key
                  ? "bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500 text-black shadow-premium"
                  : "text-white/70 hover:text-white"
              }`}
              aria-label={`Switch to ${option.currency}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-4xl font-semibold text-white sm:text-5xl lg:text-6xl">
            {priceText}
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.3em] text-white/50">
            BTC / {activeCurrency?.currency || "USD"}
          </p>
        </div>
        <div className="text-right">
          <p className={`text-2xl font-semibold ${changeClass}`}>
            {changeText}
          </p>
          <p className="mt-1 text-xs uppercase tracking-[0.3em] text-white/40">
            24h change
          </p>
        </div>
      </div>
      <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.3em] text-white/40">
        <span>Updated {updatedLabel}</span>
        <span className="text-amber-300">{isLive ? "Live feed" : "Cached"}</span>
      </div>
    </div>
  );
}
