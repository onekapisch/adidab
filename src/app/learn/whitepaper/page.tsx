import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Bitcoin Whitepaper TLDR - adidab",
  description:
    "A clear TLDR of the Bitcoin whitepaper for newcomers and daily checkers.",
};

const tldrPoints = [
  "Bitcoin is electronic cash without a central authority.",
  "Transactions are grouped into blocks and chained together.",
  "Proof-of-work makes it expensive to rewrite history.",
  "Nodes follow the longest valid chain as the source of truth.",
  "Supply issuance is fixed and decreases over time.",
  "Incentives reward miners for securing the network.",
];

const highlights = [
  {
    title: "Problem",
    body:
      "Digital payments rely on trusted intermediaries. Bitcoin removes the need for that trust.",
  },
  {
    title: "Solution",
    body:
      "A public ledger with proof-of-work makes double spending economically impractical.",
  },
  {
    title: "Outcome",
    body:
      "A decentralized, predictable monetary system that anyone can verify.",
  },
];

export default function WhitepaperPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-12 px-6 pb-20 pt-16 sm:px-8 lg:px-12">
      <div className="space-y-6">
        <Link
          href="/learn"
          className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/80 transition hover:border-white/30 hover:text-white"
        >
          Back to Learn
        </Link>
        <h1 className="text-4xl font-semibold text-white sm:text-5xl">
          Bitcoin Whitepaper - TLDR
        </h1>
        <p className="max-w-2xl text-base text-white/60">
          A newcomer-friendly summary of the original Bitcoin whitepaper. Read
          this first, then open the full PDF when you want the details.
        </p>
      </div>

      <section className="glass-card p-8 gold-glow">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">
          TLDR
        </p>
        <ul className="mt-4 space-y-2 text-sm text-white/70">
          {tldrPoints.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="https://bitcoin.org/bitcoin.pdf"
            target="_blank"
            rel="noreferrer"
            className="inline-flex rounded-full bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-black shadow-premium transition hover:opacity-90"
          >
            Open Whitepaper PDF
          </a>
          <Link
            href="/tools"
            className="inline-flex rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/80 transition hover:border-white/30 hover:text-white"
          >
            Open Tools
          </Link>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {highlights.map((item) => (
          <div key={item.title} className="soft-card p-6 gold-border">
            <h2 className="text-2xl font-semibold text-white">{item.title}</h2>
            <p className="mt-3 text-sm text-white/60">{item.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
