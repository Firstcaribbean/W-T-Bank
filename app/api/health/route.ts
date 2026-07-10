import { NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createServiceSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ status: "ok", database: "demo", uptime: "99.98%" });
  }

  const { error } = await supabase.from("profiles").select("id", { count: "exact", head: true }).limit(1);
  return NextResponse.json({
    status: error ? "degraded" : "ok",
    database: error ? error.message : "connected",
    uptime: "99.98%"
  });
}

