import Link from "next/link";

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Tools", href: "/tools" },
  { label: "Whales", href: "/whales" },
  { label: "Learn", href: "/learn" },
  { label: "Community", href: "/community" },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/5 bg-black/40">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-300/40 to-transparent" />
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-12 sm:px-8 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f7931a] text-lg font-semibold text-white shadow-premium">
              ₿
            </span>
            <div>
              <p className="text-lg font-semibold text-white">
                adi<span className="text-gradient">dab</span>
              </p>
              <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                All Day I Dream About Bitcoin
              </p>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-white/60">
            A premium daily ritual built for newcomers and daily checkers.
            Price, tools, and clarity without the noise.
          </p>
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">
            Data sources: CoinGecko, Alternative.me, Whale Alert, Stooq
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
            Explore
          </p>
          <div className="grid gap-2">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-white/70 transition hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
            Daily Ritual
          </p>
          <p className="text-sm text-white/60">
            Price, sentiment, whale activity, and predictions at a glance.
          </p>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/60">
            Start here, then dive into tools and learning.
          </div>
          <p className="text-xs text-white/40">Focused on Bitcoin only.</p>
        </div>
      </div>
      <div className="border-t border-white/5 px-6 py-6 text-center text-xs text-white/40 sm:px-8 lg:px-12">
        (c) 2026 adidab.com. All rights reserved.
      </div>
    </footer>
  );
}
