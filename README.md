# adidab.com

All Day I Dream About Bitcoin — a premium daily ritual for newcomers and daily checkers.

## Why It Exists
adidab turns chaotic Bitcoin checking into a calm, repeatable ritual. Fast, beautiful, and focused on what matters.

## What You Get
- Live BTC price with a premium USD/EUR toggle.
- Fear & Greed sentiment gauge with 30-day trend.
- Whale activity highlights + dedicated deep dive page.
- Daily prediction game to keep users coming back.
- Market Pulse chart with multiple time ranges + long-arc history.
- Tools for DCA planning, time machine, halving countdown, converter, and alerts.
- Learn path plus a whitepaper TLDR.

## Stack
- Next.js (App Router) + TypeScript
- Tailwind CSS
- Data: CoinGecko, Alternative.me, Whale Alert (optional), Stooq
- Hosting: Vercel

## Quick Start
```bash
npm install
npm run dev
```

## Environment Variables
Create a `.env.local`:
```
# Whale activity (optional but recommended)
WHALE_ALERT_API_KEY=

# Analytics (optional)
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=

# Monitoring (optional)
SENTRY_DSN=
NEXT_PUBLIC_SENTRY_DSN=
```

## Build
```bash
npm run build
npm run start
```

## Notes
- Whale activity uses Whale Alert when configured; otherwise it falls back to public mempool data.
- Top holders list is a curated static dataset in `src/lib/holders.ts` and should be refreshed periodically.
