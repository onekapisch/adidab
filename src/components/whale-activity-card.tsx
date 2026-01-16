import Link from "next/link";
import { formatNumber } from "@/lib/market";
import {
  formatWhaleAmountUsd,
  formatWhaleEntity,
  formatWhaleTimeAgo,
  getSignalCopy,
  type WhaleTransaction,
} from "@/lib/whales";

type WhaleActivityCardProps = {
  transactions: WhaleTransaction[];
};

const signalMap = {
  bullish: { label: "Bullish", tone: "text-emerald-300", dot: "bg-emerald-400" },
  bearish: { label: "Bearish", tone: "text-rose-300", dot: "bg-rose-400" },
  neutral: { label: "Neutral", tone: "text-white/50", dot: "bg-white/40" },
} as const;

export default function WhaleActivityCard({
  transactions,
}: WhaleActivityCardProps) {
  const items = transactions.slice(0, 4);

  return (
    <div className="glass-card gold-glow p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg" role="img" aria-label="Whale activity">
            🐋
          </span>
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            Whale Activity
          </p>
        </div>
        <Link
          href="/whales"
          className="text-xs uppercase tracking-[0.3em] text-amber-300 transition hover:text-amber-200"
        >
          View All →
        </Link>
      </div>

      <div className="mt-5 space-y-5">
        {items.length ? (
          items.map((tx, index) => {
            const signal = signalMap[tx.signal];
            const amountUsd = formatWhaleAmountUsd(tx.amountUsd);
            const fromLabel = formatWhaleEntity(tx.from);
            const toLabel = formatWhaleEntity(tx.to);
            const timeAgo = formatWhaleTimeAgo(tx.timestamp);
            return (
              <div
                key={tx.id}
                className={index === items.length - 1 ? "" : "border-b border-white/10 pb-5"}
              >
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/50">
                  <span className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${signal.dot}`} />
                    {timeAgo}
                  </span>
                  <span className={signal.tone}>{signal.label}</span>
                </div>
                <p className="mt-3 text-lg font-semibold text-white">
                  {formatNumber(tx.amount)} BTC{" "}
                  <span className="text-sm text-white/60">({amountUsd})</span>
                </p>
                <p className="mt-1 text-sm text-white/60">
                  {fromLabel} → {toLabel}
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.3em] text-white/40">
                  {getSignalCopy(tx.signal)}
                </p>
              </div>
            );
          })
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
            Whale activity feed is temporarily unavailable.
          </div>
        )}
      </div>
    </div>
  );
}
