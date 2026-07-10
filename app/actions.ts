"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createServiceSupabaseClient, createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdmin, requireUser } from "@/lib/auth";

const hasSupabaseEnv = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const transferSchema = z.object({ fromAccountId: z.string().min(1), toAccountNumber: z.string().min(6), amount: z.coerce.number().positive(), note: z.string().max(120).optional() });
const billSchema = z.object({ accountId: z.string().min(1), biller: z.string().min(2), amount: z.coerce.number().positive(), reference: z.string().optional() });
const airtimeSchema = z.object({ accountId: z.string().min(1), network: z.string().min(2), phone: z.string().min(6), amount: z.coerce.number().positive() });
const supportSchema = z.object({ subject: z.string().min(3), message: z.string().min(10), priority: z.string().default("normal") });

export async function transferFunds(_: unknown, formData: FormData): Promise<void> {
  const user = await requireUser();
  const payload = transferSchema.parse(Object.fromEntries(formData.entries()));
  if (!hasSupabaseEnv) {
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/transfers");
    return;
  }
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.rpc("transfer_funds", { p_from_account_id: payload.fromAccountId, p_to_account_number: payload.toAccountNumber, p_amount: payload.amount, p_note: payload.note ?? `Transfer from ${user.full_name}` });
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/transfers");
}

export async function payBill(_: unknown, formData: FormData): Promise<void> {
  await requireUser();
  const payload = billSchema.parse(Object.fromEntries(formData.entries()));
  if (!hasSupabaseEnv) {
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/payments");
    return;
  }
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.rpc("pay_bill", { p_account_id: payload.accountId, p_biller: payload.biller, p_amount: payload.amount, p_reference: payload.reference ?? null });
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/payments");
}

export async function buyAirtime(_: unknown, formData: FormData): Promise<void> {
  await requireUser();
  const payload = airtimeSchema.parse(Object.fromEntries(formData.entries()));
  if (!hasSupabaseEnv) {
    revalidatePath("/dashboard");
    return;
  }
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.rpc("buy_airtime", { p_account_id: payload.accountId, p_network: payload.network, p_phone: payload.phone, p_amount: payload.amount });
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
}

export async function createSupportTicket(_: unknown, formData: FormData): Promise<void> {
  const user = await requireUser();
  const payload = supportSchema.parse(Object.fromEntries(formData.entries()));
  if (!hasSupabaseEnv) {
    revalidatePath("/dashboard/support");
    return;
  }
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("support_tickets").insert({ user_id: user.id, subject: payload.subject, message: payload.message, priority: payload.priority, status: "open" });
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/support");
}

export async function reviewKyc(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!hasSupabaseEnv) {
    revalidatePath("/admin/kyc-verification");
    revalidatePath("/admin");
    return;
  }
  const supabase = createServiceSupabaseClient() ?? createSupabaseServerClient();
  const { error } = await supabase.from("kyc_verifications").update({ status, reviewed_at: new Date().toISOString() }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/kyc-verification");
  revalidatePath("/admin");
}

export async function updateProfileAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const full_name = String(formData.get("full_name") ?? user.full_name);
  const phone = String(formData.get("phone") ?? "");
  if (!hasSupabaseEnv) {
    revalidatePath("/dashboard/settings");
    return;
  }
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("profiles").update({ full_name, phone }).eq("id", user.id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/settings");
}

export async function logoutAction() {
  if (!hasSupabaseEnv) redirect("/login");
  const supabase = createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}
