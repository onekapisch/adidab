import FearGreedGauge from "@/components/fear-greed-gauge";
import MetricCard from "@/components/metric-card";
import LivePriceTile from "@/components/live-price-tile";
import LongArcPanel from "@/components/long-arc-panel";
import MarketPulsePanel from "@/components/market-pulse-panel";
import PredictionCard from "@/components/prediction-card";
import WhaleActivityCard from "@/components/whale-activity-card";
import { getFearGreedIndex } from "@/lib/fear-greed";
import {
  formatNumber,
  getBitcoinChart,
  getBitcoinHistory,
  getBitcoinSummary,
  satsPerDollar,
} from "@/lib/market";
import { getWhaleTransactions } from "@/lib/whales";
import Link from "next/link";

export const revalidate = 60;

export default async function Home() {
  const [summary, chart, history, sentiment, whales] = await Promise.all([
    getBitcoinSummary(),
    getBitcoinChart(30),
    getBitcoinHistory(),
    getFearGreedIndex(30),
    getWhaleTransactions({ limit: 4, minBtc: 100 }),
  ]);

  const satsText = summary.price
    ? formatNumber(satsPerDollar(summary.price)!)
    : "--";

  return (
    <div className="space-y-24 pb-20">
      <section className="relative overflow-hidden">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 px-6 pb-10 pt-20 text-center sm:px-8 lg:px-12 lg:pt-28">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70">
              Premium Bitcoin Ritual
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <h1 className="max-w-5xl text-5xl font-semibold leading-[1.05] text-white sm:text-6xl lg:text-7xl xl:text-8xl">
              All Day I Dream About{" "}
              <span className="text-gradient">₿itcoin</span>
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
              A premium daily dashboard for newcomers and daily checkers.
              Track the essentials, learn with clarity, and build a consistent
              Bitcoin habit.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/tools"
                className="rounded-full bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-black shadow-premium transition hover:opacity-90"
              >
                Start Your Ritual
              </Link>
              <Link
                href="/learn"
                className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/80 transition hover:border-white/30 hover:text-white"
              >
                Learn the Basics
              </Link>
            </div>
            <div className="grid w-full gap-4 lg:grid-cols-[2fr_1fr]">
              <LivePriceTile initialSummary={summary} />
              <div className="flex h-full flex-col gap-4">
                <FearGreedGauge data={sentiment} />
                <MetricCard
                  label="Sats per Dollar"
                  value={satsText}
                  delta="Live"
                  accent="teal"
                  size="compact"
                />
              </div>
            </div>
            <div className="grid w-full gap-6 lg:grid-cols-[1.4fr_1fr]">
              <WhaleActivityCard transactions={whales} />
              <PredictionCard currentPrice={summary.price} />
            </div>
          </div>
          <MarketPulsePanel initialSummary={summary} initialChart={chart} size="large" />
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-8 px-6 sm:px-8 lg:px-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">
              Daily Ritual
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
              A simple rhythm for calm, informed checking.
            </h2>
          </div>
          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/60">
            Designed for newcomers
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            {
              title: "Morning Scan",
              description:
                "Check price, dominance, and sats per dollar in under 30 seconds.",
              time: "02 min",
            },
            {
              title: "Midday Learn",
              description:
                "Read one clear concept from the Learn path. Build confidence daily.",
              time: "05 min",
            },
            {
              title: "Evening Wrap",
              description:
                "Review the daily trend, compare to weekly levels, and set alerts.",
              time: "03 min",
            },
          ].map((item) => (
            <div key={item.title} className="soft-card p-6 gold-border">
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                {item.time}
              </p>
              <h3 className="mt-3 text-xl font-semibold text-white">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-8 px-6 sm:px-8 lg:px-12">
        <LongArcPanel initialHistory={history} />
      </section>

      <section className="mx-auto max-w-6xl space-y-10 px-6 sm:px-8 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="glass-card p-8 gold-glow">
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">
              Daily Checker Stack
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-white">
              The tools that keep your Bitcoin habit sharp.
            </h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                "Sats per dollar tracker",
                "DCA planner",
                "Alert presets",
                "Time machine simulator",
                "Halving countdown",
                "Portfolio snapshot",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70"
                >
                  {item}
                </div>
              ))}
            </div>
            <Link
              href="/tools"
              className="mt-6 inline-flex rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/80 transition hover:border-white/30 hover:text-white"
            >
              Explore Tools
            </Link>
          </div>
          <div className="soft-card p-8 gold-border">
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">
              Learn Path
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-white">
              Start with clarity, not noise.
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-white/60">
              <li>Bitcoin in five minutes</li>
              <li>Wallets and self-custody basics</li>
              <li>Lightning network and fees</li>
              <li>Long-term mindset for daily checkers</li>
            </ul>
            <Link
              href="/learn"
              className="mt-6 inline-flex rounded-full bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-black shadow-premium transition hover:opacity-90"
            >
              Start Learning
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
        <div className="glass-card grid gap-8 p-10 lg:grid-cols-[1.1fr_0.9fr] gold-glow">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">
              Whale Deep Dive
            </p>
            <h3 className="mt-3 text-3xl font-semibold text-white">
              Follow the biggest Bitcoin transfers in real time.
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              Track exchange inflows, outflows, and major wallet moves to read
              market intent faster.
            </p>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
              Today: Exchange deposits and whale accumulation signals, sorted
              by impact.
            </div>
            <Link
              href="/whales"
              className="inline-flex rounded-full border border-white/10 bg-white/5 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/80 transition hover:border-white/30 hover:text-white"
            >
              Open Whale Watch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
