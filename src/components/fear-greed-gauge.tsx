import Sparkline from "@/components/sparkline";
import type { FearGreedData } from "@/lib/fear-greed";

type FearGreedGaugeProps = {
  data: FearGreedData;
};

function clampValue(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

function toneClass(score: number) {
  if (score < 30) return "text-rose-300";
  if (score < 55) return "text-amber-300";
  if (score < 75) return "text-emerald-300";
  return "text-emerald-200";
}

export default function FearGreedGauge({ data }: FearGreedGaugeProps) {
  const score = data.value ?? 0;
  const clamped = clampValue(score);
  const label = data.classification ?? "Neutral";
  const history = data.history.map((point) => point.value);
  const updatedLabel = data.updatedAt
    ? new Date(data.updatedAt).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })
    : "--";

  return (
    <div className="glass-card gold-glow p-6 lg:p-7">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">
          Fear &amp; Greed
        </p>
        <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-amber-200">
          Live
        </span>
      </div>

      <div className="mt-5">
        <div className="flex items-baseline justify-between">
          <p className="text-4xl font-semibold text-white">{clamped}</p>
          <p className={`text-xs uppercase tracking-[0.3em] ${toneClass(clamped)}`}>
            {label}
          </p>
        </div>
        <div className="relative mt-4 h-3 w-full rounded-full bg-gradient-to-r from-rose-400 via-amber-300 to-emerald-300">
          <span
            className="absolute -top-2 h-7 w-7 -translate-x-1/2 rounded-full border border-white/20 bg-black/80 shadow-premium"
            style={{ left: `${clamped}%` }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-white/40">
          <span>Fear</span>
          <span>Greed</span>
        </div>
      </div>

      <div className="mt-4">
        {history.length ? (
          <Sparkline data={history} height={70} className="h-16" />
        ) : (
          <div className="flex h-16 items-center justify-center rounded-2xl border border-white/10 bg-black/40 text-xs text-white/50">
            Trend unavailable.
          </div>
        )}
        <div className="mt-2 flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-white/40">
          <span>30-day trend</span>
          <span>Updated {updatedLabel}</span>
        </div>
      </div>
    </div>
  );
}
