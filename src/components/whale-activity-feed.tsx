import { formatNumber } from "@/lib/market";
import {
  formatWhaleAmountUsd,
  formatWhaleEntity,
  formatWhaleTimeAgo,
  getSignalCopy,
  type WhaleTransaction,
} from "@/lib/whales";

type WhaleActivityFeedProps = {
  transactions: WhaleTransaction[];
};

const signalMap = {
  bullish: { label: "Bullish", tone: "text-emerald-300", dot: "bg-emerald-400" },
  bearish: { label: "Bearish", tone: "text-rose-300", dot: "bg-rose-400" },
  neutral: { label: "Neutral", tone: "text-white/50", dot: "bg-white/40" },
} as const;

export default function WhaleActivityFeed({
  transactions,
}: WhaleActivityFeedProps) {
  return (
    <div className="glass-card gold-glow p-8 lg:p-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            Whale Activity Feed
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-white">
            The biggest Bitcoin transfers, decoded.
          </h2>
        </div>
        <div className="rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-amber-200">
          Live
        </div>
      </div>

      <div className="mt-8 space-y-5">
        {transactions.length ? (
          transactions.map((tx) => {
            const signal = signalMap[tx.signal];
            const amountUsd = formatWhaleAmountUsd(tx.amountUsd);
            const fromLabel = formatWhaleEntity(tx.from);
            const toLabel = formatWhaleEntity(tx.to);
            const timeAgo = formatWhaleTimeAgo(tx.timestamp);
            return (
              <div
                key={tx.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.3em] text-white/50">
                  <span className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${signal.dot}`} />
                    {timeAgo}
                  </span>
                  <span className={signal.tone}>{signal.label}</span>
                </div>
                <div className="mt-3 flex flex-wrap items-baseline justify-between gap-3">
                  <p className="text-xl font-semibold text-white">
                    {formatNumber(tx.amount)} BTC{" "}
                    <span className="text-sm text-white/60">({amountUsd})</span>
                  </p>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                    {getSignalCopy(tx.signal)}
                  </p>
                </div>
                <p className="mt-2 text-sm text-white/60">
                  {fromLabel} → {toLabel}
                </p>
              </div>
            );
          })
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
            Whale feed unavailable. Add a Whale Alert API key to enable live
            data.
          </div>
        )}
      </div>
    </div>
  );
}
