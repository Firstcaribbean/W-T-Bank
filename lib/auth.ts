import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "./supabase/server";
import { demoAdminProfile, demoProfile } from "@/lib/mock-bank";

function hasSupabaseEnv() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export async function getSessionUser() {
  if (!hasSupabaseEnv()) return demoProfile;
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

export async function getProfile(roleHint: "user" | "admin" = "user") {
  if (!hasSupabaseEnv()) return roleHint === "admin" ? demoAdminProfile : demoProfile;

  const supabase = createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", auth.user.id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function requireUser() {
  const profile = await getProfile("user");
  if (!profile) redirect("/login");
  return profile;
}

export async function requireAdmin() {
  const profile = await getProfile("admin");
  if (!profile) redirect("/login");
  if (profile.role !== "admin") redirect("/dashboard");
  return profile;
}
