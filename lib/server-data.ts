import { createSupabaseServerClient } from "@/lib/supabase/server";
import { demoAccounts, demoCards, demoExchangeRates, demoNotifications, demoProfile, demoTransactions, spendingByCategory, adminKpiSnapshot } from "@/lib/mock-bank";
import { getProfile } from "@/lib/auth";

function hasEnv() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

function groupSpending(transactions: { category: string; amount: number }[]) {
  const groups = new Map<string, number>();
  for (const item of transactions) {
    if (item.amount >= 0) continue;
    groups.set(item.category || "Others", (groups.get(item.category || "Others") ?? 0) + Math.abs(item.amount));
  }
  const palette = ["#3b82f6", "#0ea5e9", "#14b8a6", "#22c55e", "#f59e0b", "#64748b"];
  return Array.from(groups.entries()).map(([category, amount], index) => ({ category, amount, color: palette[index % palette.length] }));
}

export async function getUserDashboardData() {
  const profile = (await getProfile("user")) ?? demoProfile;

  if (!hasEnv()) {
    return {
      profile,
      accounts: demoAccounts,
      transactions: demoTransactions,
      cards: demoCards,
      notifications: demoNotifications,
      exchangeRates: demoExchangeRates,
      spending: spendingByCategory()
    };
  }

  const supabase = createSupabaseServerClient();
  const [accountsRes, transactionsRes, cardsRes, notificationsRes, exchangeRatesRes] = await Promise.all([
    supabase.from("accounts").select("*").order("created_at", { ascending: true }),
    supabase.from("transactions").select("*").order("created_at", { ascending: false }).limit(20),
    supabase.from("cards").select("*").order("created_at", { ascending: false }),
    supabase.from("notifications").select("*").order("created_at", { ascending: false }).limit(10),
    supabase.from("exchange_rates").select("*").order("updated_at", { ascending: false })
  ]);

  const transactions = transactionsRes.data ?? demoTransactions;
  return {
    profile,
    accounts: accountsRes.data?.length ? accountsRes.data : demoAccounts,
    transactions,
    cards: cardsRes.data?.length ? cardsRes.data : demoCards,
    notifications: notificationsRes.data?.length ? notificationsRes.data : demoNotifications,
    exchangeRates: exchangeRatesRes.data?.length ? exchangeRatesRes.data : demoExchangeRates,
    spending: groupSpending(transactions)
  };
}

export async function getAdminDashboardData() {
  const profile = (await getProfile("admin")) ?? demoProfile;

  if (!hasEnv()) {
    return {
      profile,
      kpis: adminKpiSnapshot(),
      recentTransactions: demoTransactions,
      recentUsers: [demoProfile],
      kycCounts: [
        { status: "verified", count: 180 },
        { status: "pending", count: 24 },
        { status: "rejected", count: 12 }
      ],
      accountTypes: [
        { name: "Savings", count: 1100 },
        { name: "Current", count: 900 },
        { name: "Fixed Deposit", count: 540 },
        { name: "Loan", count: 260 },
        { name: "Others", count: 820 }
      ],
      userTypes: [
        { name: "Retail", count: 1800 },
        { name: "Corporate", count: 420 },
        { name: "Investment Banking", count: 130 },
        { name: "Others", count: 136 }
      ],
      system: {
        server: "Healthy",
        database: "Healthy",
        backup: "Latest backup 2h ago",
        uptime: "99.98%"
      }
    };
  }

  const supabase = createSupabaseServerClient();
  const [profilesRes, accountsRes, txRes, kycRes] = await Promise.all([
    supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(12),
    supabase.from("accounts").select("*").order("created_at", { ascending: false }).limit(12),
    supabase.from("transactions").select("*").order("created_at", { ascending: false }).limit(12),
    supabase.from("kyc_verifications").select("status")
  ]);

  const kycCounts = ["verified", "pending", "rejected"].map((status) => ({
    status,
    count: kycRes.data?.filter((item: any) => item.status === status).length ?? 0
  }));

  return {
    profile,
    kpis: adminKpiSnapshot(),
    recentTransactions: txRes.data?.length ? txRes.data : demoTransactions,
    recentUsers: profilesRes.data?.length ? profilesRes.data : [demoProfile],
    kycCounts,
    accountTypes: [
      { name: "Savings", count: accountsRes.data?.filter((item: any) => item.type === "savings").length ?? 0 },
      { name: "Current", count: accountsRes.data?.filter((item: any) => item.type === "current").length ?? 0 },
      { name: "Fixed Deposit", count: accountsRes.data?.filter((item: any) => item.type === "fixed_deposit").length ?? 0 },
      { name: "Loan", count: 0 },
      { name: "Others", count: 0 }
    ],
    userTypes: [
      { name: "Retail", count: profilesRes.data?.filter((item: any) => item.account_type === "Retail").length ?? 0 },
      { name: "Corporate", count: profilesRes.data?.filter((item: any) => item.account_type === "Corporate").length ?? 0 },
      { name: "Investment Banking", count: profilesRes.data?.filter((item: any) => item.account_type === "Investment Banking").length ?? 0 },
      { name: "Others", count: profilesRes.data?.filter((item: any) => !["Retail", "Corporate", "Investment Banking"].includes(item.account_type)).length ?? 0 }
    ],
    system: {
      server: "Healthy",
      database: "Healthy",
      backup: "Managed by Supabase",
      uptime: "99.98%"
    }
  };
}

