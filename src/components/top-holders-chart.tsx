import { formatNumber } from "@/lib/market";
import { TOP_HOLDERS, topHolderShare, type BitcoinHolder } from "@/lib/holders";

const typeIcons: Record<BitcoinHolder["type"], string> = {
  exchange: "🏦",
  etf: "📈",
  government: "🏛️",
  company: "🏢",
  individual: "👤",
  unknown: "👻",
};

export default function TopHoldersChart() {
  const maxPercent = Math.max(...TOP_HOLDERS.map((holder) => holder.percentOfSupply));

  return (
    <div className="glass-card gold-glow p-8 lg:p-10">
      <div className="flex items-center gap-3">
        <span className="text-lg" role="img" aria-label="Top holders">
          👑
        </span>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            Top Bitcoin Holders
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-white">
            Who controls the biggest stacks?
          </h2>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {TOP_HOLDERS.map((holder) => {
          const width = (holder.percentOfSupply / maxPercent) * 100;
          return (
            <div
              key={holder.rank}
              className="rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs uppercase tracking-[0.3em] text-white/40">
                    {holder.rank.toString().padStart(2, "0")}
                  </span>
                  <span className="text-base font-semibold text-white">
                    {typeIcons[holder.type]} {holder.name}
                  </span>
                </div>
                <div className="text-right text-sm text-white/60">
                  <div className="text-white">
                    {formatNumber(holder.btcBalance)} BTC
                  </div>
                  <div>{holder.percentOfSupply.toFixed(2)}% of supply</div>
                </div>
              </div>
              <div className="mt-3 h-2 w-full rounded-full bg-white/10">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500"
                  style={{ width: `${width}%` }}
                />
              </div>
              {holder.note ? (
                <p className="mt-2 text-xs text-white/50">{holder.note}</p>
              ) : null}
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-xs uppercase tracking-[0.3em] text-white/40">
        Top 10 holders control ~{topHolderShare.toFixed(2)}% of all Bitcoin.
      </p>
    </div>
  );
}
