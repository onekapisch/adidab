import type { Metadata } from "next";
import Link from "next/link";
import { lessons } from "@/lib/lessons";

export const metadata: Metadata = {
  title: "Learn - adidab",
  description:
    "A guided Bitcoin learning path for newcomers, designed for daily checkers who want clarity without noise.",
};

export default function LearnPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-16 px-6 pb-20 pt-16 sm:px-8 lg:px-12">
      <section className="space-y-6">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">
          Learn Bitcoin
        </p>
        <h1 className="text-4xl font-semibold text-white sm:text-5xl">
          A clear learning path for newcomers.
        </h1>
        <p className="max-w-2xl text-base text-white/60">
          Each lesson is short, practical, and designed for daily checkers who
          want confidence without information overload.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        {lessons.map((module) => (
          <div key={module.title} className="soft-card p-6 gold-border">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                {module.level}
              </p>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-white/60">
                6 min
              </span>
            </div>
            <h3 className="mt-3 text-xl font-semibold text-white">
              {module.title}
            </h3>
            <p className="mt-3 text-sm text-white/60">{module.summary}</p>
            <Link
              href={`/learn/${module.slug}`}
              className="mt-6 inline-flex rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/80 transition hover:border-white/30 hover:text-white"
            >
              Start Lesson
            </Link>
          </div>
        ))}
      </section>

      <section className="glass-card p-8 gold-glow">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">
              Whitepaper
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white">
              The original Bitcoin paper, with a clear TLDR.
            </h2>
            <p className="mt-4 text-sm text-white/60">
              Read the paper that started it all, plus a newcomer-friendly
              summary that explains the core ideas in plain language.
            </p>
          </div>
          <div className="space-y-4 text-sm text-white/60">
            <ul className="space-y-2">
              <li>Fixed supply with a predictable issuance schedule.</li>
              <li>Blocks chain together to prevent double spending.</li>
              <li>Proof-of-work secures the ledger without a central authority.</li>
              <li>Incentives align miners with network security.</li>
            </ul>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/learn/whitepaper"
                className="inline-flex rounded-full bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-black shadow-premium transition hover:opacity-90"
              >
                Read TLDR
              </Link>
              <a
                href="https://bitcoin.org/bitcoin.pdf"
                target="_blank"
                rel="noreferrer"
                className="inline-flex rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/80 transition hover:border-white/30 hover:text-white"
              >
                Open PDF
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="glass-card p-8">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">
              Daily Checklist
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white">
              Build a habit that keeps you calm.
            </h2>
            <p className="mt-4 text-sm text-white/60">
              Use this learning checklist every week to reinforce the essentials
              and keep your daily checks grounded.
            </p>
          </div>
          <ul className="space-y-3 text-sm text-white/60">
            <li>Review one concept a day</li>
            <li>Practice safe wallet habits weekly</li>
            <li>Understand fees before moving funds</li>
            <li>Focus on the long-term supply story</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
