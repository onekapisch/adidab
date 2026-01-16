"use client";

import { useEffect, useMemo, useState } from "react";
import type { HalvingEstimate } from "@/lib/halving";

type HalvingCountdownProps = {
  initialEstimate: HalvingEstimate;
};

type HalvingResponse = {
  halving?: HalvingEstimate;
};

export default function HalvingCountdown({
  initialEstimate,
}: HalvingCountdownProps) {
  const [estimate, setEstimate] = useState<HalvingEstimate>(initialEstimate);
  const [isLive, setIsLive] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>(
    initialEstimate.updatedAt
  );

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const response = await fetch("/api/halving");
        if (!response.ok) {
          throw new Error("Failed to load halving data");
        }
        const data = (await response.json()) as HalvingResponse;
        if (!active) return;
        if (data.halving) {
          setEstimate(data.halving);
          setLastUpdated(data.halving.updatedAt ?? new Date().toISOString());
        }
        setIsLive(true);
      } catch {
        if (!active) return;
        setIsLive(false);
      }
    };

    load();
    const interval = setInterval(load, 10 * 60 * 1000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const etaLabel = useMemo(() => {
    if (!estimate.estimatedDate) return "--";
    return new Date(estimate.estimatedDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, [estimate.estimatedDate]);

  const lastUpdatedLabel = useMemo(() => {
    if (!lastUpdated) return "--";
    return new Date(lastUpdated).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  }, [lastUpdated]);

  const progress = useMemo(() => {
    if (!estimate.height) return 0;
    const cycle = estimate.height % 210_000;
    return Math.min(100, Math.max(0, (cycle / 210_000) * 100));
  }, [estimate.height]);

  return (
    <div className="soft-card p-6 gold-glow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            Halving Countdown
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-white">
            Next halving in view.
          </h3>
        </div>
        <div className="rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-amber-200">
          {isLive ? "Live" : "Offline"}
        </div>
      </div>

      <div className="mt-6 grid gap-4 text-sm text-white/60 sm:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">
            Blocks remaining
          </p>
          <p className="mt-2 text-xl font-semibold text-white">
            {estimate.blocksRemaining ?? "--"}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">
            Estimated date
          </p>
          <p className="mt-2 text-xl font-semibold text-white">{etaLabel}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">
            Days remaining
          </p>
          <p className="mt-2 text-xl font-semibold text-white">
            {estimate.estimatedDays ?? "--"}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <div className="h-2 w-full rounded-full bg-white/5">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-3 text-xs text-white/40">
          Updated {lastUpdatedLabel} local time. Estimates assume 10 min blocks.
        </p>
      </div>
    </div>
  );
}
