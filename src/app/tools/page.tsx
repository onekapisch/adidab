import HalvingCountdown from "@/components/halving-countdown";
import PriceAlerts from "@/components/price-alerts";
import TimeMachinePanel from "@/components/time-machine-panel";
import ToolsCalculators from "@/components/tools-calculators";
import { getSp500Series } from "@/lib/benchmarks";
import { getHalvingEstimate } from "@/lib/halving";
import { formatUsd, getBitcoinHistorySeries, getBitcoinSummary } from "@/lib/market";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tools - adidab",
  description:
    "Premium Bitcoin tools for newcomers and daily checkers: sats per dollar, DCA planning, and daily rituals.",
};

export const revalidate = 60;

export default async function ToolsPage() {
  const [summary, historySeries, halving, spSeries] = await Promise.all([
    getBitcoinSummary(),
    getBitcoinHistorySeries(),
    getHalvingEstimate(),
    getSp500Series(),
  ]);
  const priceText = summary.price ? formatUsd(summary.price, 2) : "--";

  return (
    <div className="mx-auto max-w-6xl space-y-16 px-6 pb-20 pt-16 sm:px-8 lg:px-12">
      <section className="space-y-6">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">
          Bitcoin Tools
        </p>
        <h1 className="text-4xl font-semibold text-white sm:text-5xl">
          Practical tools for calm, daily checking.
        </h1>
        <p className="max-w-2xl text-base text-white/60">
          Keep your daily routine simple. Start with sats per dollar and DCA
          planning, then build toward deeper insights.
        </p>
        <div className="inline-flex items-center gap-3 rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-amber-200">
          Current BTC price: {priceText}
        </div>
      </section>

      <ToolsCalculators price={summary.price} />

      <section className="grid gap-6 lg:grid-cols-2">
        <TimeMachinePanel
          series={historySeries.series}
          currentPrice={summary.price}
          benchmarkSeries={spSeries}
        />
        <HalvingCountdown initialEstimate={halving} />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <PriceAlerts initialSummary={summary} />
        <div className="soft-card p-6 gold-border">
          <h3 className="text-2xl font-semibold text-white">
            Utility-first tools
          </h3>
          <p className="mt-3 text-sm text-white/60">
            Everything here is built for daily utility: calculate, plan, and
            sanity-check your Bitcoin decisions in minutes.
          </p>
          <div className="mt-4 text-xs uppercase tracking-[0.3em] text-amber-300">
            Core utilities
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {[
          {
            title: "Sats Converter",
            description:
              "Convert USD to sats instantly to build a daily stacking habit.",
          },
          {
            title: "DCA Planner",
            description:
              "Preview a steady weekly plan and understand your long-term stack.",
          },
          {
            title: "Price Alerts",
            description:
              "Set local alerts for price milestones while the page is open.",
          },
        ].map((item) => (
          <div key={item.title} className="soft-card p-6 gold-border">
            <h3 className="text-xl font-semibold text-white">{item.title}</h3>
            <p className="mt-3 text-sm text-white/60">{item.description}</p>
            <div className="mt-4 text-xs uppercase tracking-[0.3em] text-amber-300">
              Available now
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
