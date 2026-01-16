import { NextResponse } from "next/server";
import { getFearGreedIndex } from "@/lib/fear-greed";

export const revalidate = 3600;

export async function GET() {
  const sentiment = await getFearGreedIndex(30);
  return NextResponse.json({ sentiment });
}
