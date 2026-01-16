import type { Metadata } from "next";
import TopHoldersChart from "@/components/top-holders-chart";
import WhaleActivityFeed from "@/components/whale-activity-feed";
import { getWhaleTransactions } from "@/lib/whales";

export const metadata: Metadata = {
  title: "Whales - adidab",
  description:
    "Track Bitcoin whale movements, exchange flows, and top holders in one premium feed.",
};

export const revalidate = 120;

export default async function WhalesPage() {
  const transactions = await getWhaleTransactions({ limit: 20, minBtc: 100 });

  return (
    <div className="mx-auto max-w-6xl space-y-16 px-6 pb-20 pt-16 sm:px-8 lg:px-12">
      <section className="space-y-6">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">
          Whale Watch
        </p>
        <h1 className="text-4xl font-semibold text-white sm:text-5xl">
          The biggest Bitcoin moves, decoded.
        </h1>
        <p className="max-w-2xl text-base text-white/60">
          Follow large transfers, exchange flows, and accumulation signals.
          Built for daily checkers who want early context.
        </p>
      </section>

      <WhaleActivityFeed transactions={transactions} />

      <TopHoldersChart />
    </div>
  );
}
