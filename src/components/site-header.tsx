import Link from "next/link";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Tools", href: "/tools" },
  { label: "Whales", href: "/whales" },
  { label: "Learn", href: "/learn" },
  { label: "Community", href: "/community" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0c0c10]">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3 sm:px-8 lg:px-12">
        <Link className="group flex items-center gap-3" href="/">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f7931a] text-lg font-semibold leading-none text-white shadow-premium"
            aria-hidden="true"
          >
            ₿
          </span>
          <div className="leading-tight">
            <span className="block text-lg font-semibold tracking-wide text-white">
              adi<span className="text-gradient">dab</span>
            </span>
            <span className="hidden text-xs uppercase tracking-[0.2em] text-white/50 sm:block">
              Daily Bitcoin Ritual
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-white/70 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            className="hidden items-center rounded-full bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-black shadow-premium transition hover:opacity-90 sm:inline-flex"
            href="/tools"
          >
            Start Now
          </Link>
          <details className="relative md:hidden">
            <summary className="cursor-pointer rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
              Menu
            </summary>
            <div className="absolute right-0 mt-3 w-48 space-y-2 rounded-2xl border border-white/10 bg-black/90 p-3 shadow-premium">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/5"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </details>
        </div>
      </div>
      <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-300/50 to-transparent" />
    </header>
  );
}
