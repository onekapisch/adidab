import type { HistorySeriesPoint } from "@/lib/market";

const STOOQ_BASE = "https://stooq.com/q/d/l/";

async function fetchText(url: string, revalidateSeconds = 86_400) {
  try {
    const response = await fetch(url, {
      next: { revalidate: revalidateSeconds },
    });
    if (!response.ok) {
      return null;
    }
    return await response.text();
  } catch {
    return null;
  }
}

export async function getSp500Series(): Promise<HistorySeriesPoint[]> {
  const csv = await fetchText(`${STOOQ_BASE}?s=^spx&i=d`, 86_400);
  if (!csv) {
    return [];
  }

  const lines = csv.trim().split("\n");
  if (lines.length <= 1) {
    return [];
  }

  return lines
    .slice(1)
    .map((line) => {
      const [date, , , , close] = line.split(",");
      const timestamp = date ? new Date(date).getTime() : NaN;
      const price = Number(close);
      if (!Number.isFinite(timestamp) || !Number.isFinite(price)) {
        return null;
      }
      return { timestamp, price };
    })
    .filter((point): point is HistorySeriesPoint => Boolean(point));
}
