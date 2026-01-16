import { NextResponse } from "next/server";
import { getHalvingEstimate } from "@/lib/halving";

export const revalidate = 300;

export async function GET() {
  const halving = await getHalvingEstimate();
  return NextResponse.json({ halving });
}
