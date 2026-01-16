# adidab.com

All Day I Dream About Bitcoin. A premium daily ritual for newcomers and daily checkers.

## Highlights
- Live BTC price, Fear & Greed sentiment, whale activity, and prediction game.
- Market Pulse chart with multiple ranges and long-arc history.
- Utility-first tools: DCA planner, time machine, halving countdown, converter, alerts.
- Learn path + whitepaper TLDR.

## Tech Stack
- Next.js (App Router) + TypeScript
- Tailwind CSS
- Data: CoinGecko, Alternative.me, Whale Alert (optional), Stooq
- Hosting: Vercel

## Getting Started
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
- Top holders list is a curated static dataset in `src/lib/holders.ts`.
