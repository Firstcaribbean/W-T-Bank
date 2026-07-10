import { NextRequest, NextResponse } from "next/server";
import { spendingByCategory } from "@/lib/mock-bank";

export async function GET(request: NextRequest) {
  const range = request.nextUrl.searchParams.get("range") ?? "This Month";
  const data = spendingByCategory();
  const factor = range === "Last Month" ? 0.82 : range === "Last 3 Months" ? 2.4 : range === "This Year" ? 8.5 : 1;
  const adjusted = data.map((item) => ({ ...item, amount: Math.round(item.amount * factor) }));
  return NextResponse.json({ data: adjusted, total: adjusted.reduce((sum, item) => sum + item.amount, 0) });
}
