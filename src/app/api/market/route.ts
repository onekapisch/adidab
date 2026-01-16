import { NextResponse } from "next/server";
import { getBitcoinChart, getBitcoinSummary } from "@/lib/market";

export const revalidate = 60;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const currency = (searchParams.get("currency") || "usd").toLowerCase();
  const daysParam = searchParams.get("days");
  const daysValue = daysParam ? Number(daysParam) : 30;
  const days = Number.isFinite(daysValue)
    ? Math.min(Math.max(daysValue, 1), 3650)
    : 30;

  const [summary, chart] = await Promise.all([
    getBitcoinSummary(currency),
    getBitcoinChart(days, 140, currency),
  ]);

  return NextResponse.json({ summary, chart });
}
