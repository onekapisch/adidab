import { NextResponse } from "next/server";
import { getWhaleTransactions } from "@/lib/whales";

export const revalidate = 120;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limitParam = Number(searchParams.get("limit") ?? 6);
  const minBtcParam = Number(searchParams.get("minBtc") ?? 100);
  const limit = Number.isFinite(limitParam) ? Math.min(limitParam, 50) : 6;
  const minBtc = Number.isFinite(minBtcParam) ? Math.max(minBtcParam, 1) : 100;

  const transactions = await getWhaleTransactions({ limit, minBtc });
  return NextResponse.json({ transactions });
}
