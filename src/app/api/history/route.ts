import { NextResponse } from "next/server";
import { getBitcoinHistory } from "@/lib/market";

export const revalidate = 3600;

export async function GET() {
  const history = await getBitcoinHistory();
  return NextResponse.json({ history });
}
