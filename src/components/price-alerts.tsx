"use client";

import { useEffect, useMemo, useState } from "react";
import { formatUsd, type MarketSummary } from "@/lib/market";

type PriceAlertsProps = {
  initialSummary: MarketSummary;
};

type MarketResponse = {
  summary?: MarketSummary;
};

const STORAGE_KEY = "adidab-alerts";

type AlertSettings = {
  target: number;
  direction: "above" | "below";
  active: boolean;
};

export default function PriceAlerts({ initialSummary }: PriceAlertsProps) {
  const [summary, setSummary] = useState<MarketSummary>(initialSummary);
  const [alert, setAlert] = useState<AlertSettings>(() => {
    if (typeof window === "undefined") {
      return {
        target: 0,
        direction: "above",
        active: false,
      };
    }
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return {
        target: 0,
        direction: "above",
        active: false,
      };
    }
    try {
      return JSON.parse(stored) as AlertSettings;
    } catch {
      return {
        target: 0,
        direction: "above",
        active: false,
      };
    }
  });
  const [status, setStatus] = useState("Idle");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(alert));
  }, [alert]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const response = await fetch("/api/market");
        if (!response.ok) return;
        const data = (await response.json()) as MarketResponse;
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

  useEffect(() => {
    if (!alert.active || !alert.target || !summary.price) return;
    const hitAbove =
      alert.direction === "above" && summary.price >= alert.target;
    const hitBelow =
      alert.direction === "below" && summary.price <= alert.target;

    if (hitAbove || hitBelow) {
      const priceLabel = summary.price
        ? formatUsd(summary.price, 2)
        : "--";
      queueMicrotask(() => {
        setAlert((prev) => ({ ...prev, active: false }));
        setStatus("Triggered");
      });
      if ("Notification" in window) {
        if (Notification.permission === "granted") {
          new Notification("Bitcoin alert from adidab", {
            body: `BTC is now ${priceLabel}.`,
          });
          return;
        }
        if (Notification.permission === "default") {
          Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
              new Notification("Bitcoin alert from adidab", {
                body: `BTC is now ${priceLabel}.`,
              });
            }
          });
          return;
        }
      }
    }
  }, [alert, summary.price]);

  const currentPrice = summary.price
    ? formatUsd(summary.price, 2)
    : "--";

  const targetLabel = useMemo(() => {
    if (!alert.target) return "--";
    return formatUsd(alert.target, 2);
  }, [alert.target]);

  return (
    <div className="soft-card p-6 gold-glow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            Alert Presets
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-white">
            Stay calm with price alerts.
          </h3>
        </div>
        <div className="rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-amber-200">
          {alert.active ? "Armed" : "Inactive"}
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div>
          <label className="text-xs uppercase tracking-[0.3em] text-white/40">
            Target price
          </label>
          <input
            type="number"
            min="1"
            value={alert.target || ""}
            onChange={(event) => {
              const value = Number(event.target.value);
              setAlert((prev) => ({
                ...prev,
                target: Number.isFinite(value) ? value : 0,
              }));
            }}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-2 text-base text-white focus:border-amber-300 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.3em] text-white/40">
            Direction
          </label>
          <div className="mt-2 flex items-center gap-2">
            {(["above", "below"] as const).map((direction) => (
              <button
                key={direction}
                type="button"
                onClick={() =>
                  setAlert((prev) => ({ ...prev, direction }))
                }
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] ${
                  alert.direction === direction
                    ? "bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500 text-black shadow-premium"
                    : "border border-white/10 bg-white/5 text-white/70"
                }`}
              >
                {direction}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => {
            if (!alert.target) {
              setStatus("Set a target first");
              return;
            }
            setAlert((prev) => ({ ...prev, active: true }));
            setStatus("Alert armed");
            if ("Notification" in window && Notification.permission === "default") {
              Notification.requestPermission();
            }
          }}
          className="rounded-full bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-black shadow-premium transition hover:opacity-90"
        >
          Arm Alert
        </button>
        <button
          type="button"
          onClick={() => {
            setAlert((prev) => ({ ...prev, active: false }));
            setStatus("Alert cleared");
          }}
          className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/80 transition hover:border-white/30 hover:text-white"
        >
          Clear
        </button>
        <span className="text-xs uppercase tracking-[0.3em] text-white/40">
          Status: {status}
        </span>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white/60">
        Current price: <span className="text-white">{currentPrice}</span> | Alert
        {alert.active ? " armed" : " inactive"} at{" "}
        <span className="text-white">{targetLabel}</span>.
      </div>
      <p className="mt-3 text-xs text-white/40">
        Alerts work while this page is open. Enable notifications for best
        results.
      </p>
    </div>
  );
}
