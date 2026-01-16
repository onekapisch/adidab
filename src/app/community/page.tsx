import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Community - adidab",
  description:
    "A calm community space for Bitcoin newcomers and daily checkers. Share routines, stay accountable, and build confidence.",
};

const communityFeatures = [
  {
    title: "Daily Checker Streaks",
    description:
      "Track your daily ritual streak and earn quiet accountability.",
  },
  {
    title: "Weekly Price Polls",
    description: "Vote on weekly price bands and compare with the community.",
  },
  {
    title: "Newcomer Circles",
    description:
      "Small groups focused on wallet safety, mindset, and fundamentals.",
  },
  {
    title: "Alert Sharing",
    description:
      "Swap alert presets that match your daily checking cadence.",
  },
];

export default function CommunityPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-16 px-6 pb-20 pt-16 sm:px-8 lg:px-12">
      <section className="space-y-6">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">
          Community
        </p>
        <h1 className="text-4xl font-semibold text-white sm:text-5xl">
          Keep your ritual accountable.
        </h1>
        <p className="max-w-2xl text-base text-white/60">
          A calm community for newcomers and daily checkers. Share routines,
          compare habits, and keep learning together.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        {communityFeatures.map((feature) => (
          <div key={feature.title} className="soft-card p-6 gold-border">
            <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
            <p className="mt-3 text-sm text-white/60">{feature.description}</p>
          </div>
        ))}
      </section>

      <section className="glass-card p-8 gold-glow">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">
              Join the Circle
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white">
              Build consistent habits with others.
            </h2>
            <p className="mt-4 text-sm text-white/60">
              The community is focused on routine, not hype. Share what you
              learned, track your streak, and grow with other newcomers.
            </p>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/60">
              Community access opens after V1. Start with the tools and learning
              path while we finalize the space.
            </div>
            <Link
              href="/tools"
              className="inline-flex w-full justify-center rounded-full bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-black shadow-premium transition hover:opacity-90"
            >
              Explore Tools
            </Link>
            <p className="text-xs text-white/40">
              Community access will be announced here.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
