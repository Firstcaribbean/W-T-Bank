"use client";

import Link from "next/link";
import { useState } from "react";
import { format, parseISO } from "date-fns";
import { ArrowRight, CheckCircle2, Clock3, Server, ShieldAlert, Users, Wallet } from "lucide-react";
import { Badge, Button, Card, CardContent, CardHeader, Input, Separator } from "@/components/ui";
import { SpendingDonut, OverviewLineChart, SimpleBar } from "@/components/charts";
import { formatCurrency } from "@/lib/utils";

function Kpi({ label, value, delta }: { label: string; value: string | number; delta: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="text-sm text-muted-fg">{label}</div>
        <div className="mt-2 text-3xl font-semibold tracking-tight">{value}</div>
        <div className="mt-3 text-sm font-medium text-emerald-600">{delta}</div>
      </CardContent>
    </Card>
  );
}

export function AdminDashboardHome({
  kpis,
  recentTransactions,
  recentUsers,
  kycCounts,
  accountTypes,
  userTypes,
  system
}: any) {
  const [range, setRange] = useState("This Month");

  const overview = recentTransactions.slice(0, 7).map((tx: any, index: number) => ({
    name: format(parseISO(tx.created_at), "MMM d"),
    count: index + 4,
    amount: Math.abs(tx.amount) * (index + 1)
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-sm text-muted-fg">Selected range</div>
          <div className="text-3xl font-semibold tracking-tight">Platform Operations</div>
        </div>
        <div className="flex items-center gap-3">
          <select value={range} onChange={(event) => setRange(event.target.value)} className="rounded-2xl border border-border bg-card px-4 py-3 text-sm">
            <option>This Month</option>
            <option>This Week</option>
            <option>This Year</option>
          </select>
          <Button variant="outline">Export CSV</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <Kpi label="Total Users" value={kpis.totalUsers.toLocaleString()} delta="+8.4% vs previous period" />
        <Kpi label="Total Accounts" value={kpis.totalAccounts.toLocaleString()} delta="+5.2% vs previous period" />
        <Kpi label="Transactions" value={kpis.totalTransactions.toLocaleString()} delta="+13.9% vs previous period" />
        <Kpi label="Total Balance" value={formatCurrency(kpis.totalBalance)} delta="+3.7% vs previous period" />
        <Kpi label="Total Profit" value={formatCurrency(kpis.totalProfit)} delta="+2.1% vs previous period" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold">Overview</div>
              <div className="text-sm text-muted-fg">Transaction count and amount across the selected period.</div>
            </div>
            <select className="rounded-xl border border-border bg-background px-3 py-2 text-sm">
              <option>This Month</option>
              <option>This Week</option>
              <option>This Year</option>
            </select>
          </CardHeader>
          <CardContent>
            <OverviewLineChart data={overview} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="text-lg font-semibold">System Overview</div>
            <div className="text-sm text-muted-fg">Derived from live health checks and uptime metadata.</div>
          </CardHeader>
          <CardContent className="space-y-3">
            <StatusLine icon={Server} label="Server Status" value={system.server} tone="success" />
            <StatusLine icon={Wallet} label="Database" value={system.database} tone="success" />
            <StatusLine icon={CheckCircle2} label="Backup Status" value={system.backup} tone="info" />
            <StatusLine icon={Clock3} label="System Uptime" value={system.uptime} tone="warning" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="text-lg font-semibold">User Registrations</div>
          </CardHeader>
          <CardContent>
            <SpendingDonut data={userTypes.map((item: any, index: number) => ({ category: item.name, amount: item.count, color: ["#2563eb", "#0ea5e9", "#14b8a6", "#64748b"][index] }))} total={userTypes.reduce((sum: number, item: any) => sum + item.count, 0)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="text-lg font-semibold">Account Types</div>
          </CardHeader>
          <CardContent>
            <SimpleBar data={accountTypes.map((item: any) => ({ name: item.name, count: item.count }))} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="text-lg font-semibold">KYC Verification</div>
            <Link href="/admin/kyc-verification" className="inline-flex items-center gap-1 text-sm font-medium text-blue-600">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent>
            <SpendingDonut data={kycCounts.map((item: any, index: number) => ({ category: item.status, amount: item.count, color: ["#22c55e", "#f59e0b", "#ef4444"][index] }))} total={kycCounts.reduce((sum: number, item: any) => sum + item.count, 0)} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold">Recent Transactions</div>
              <div className="text-sm text-muted-fg">Platform-wide ledger activity.</div>
            </div>
            <Link href="/admin/transactions" className="inline-flex items-center gap-1 text-sm font-medium text-blue-600">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentTransactions.slice(0, 5).map((tx: any) => (
              <div key={tx.id} className="flex items-center justify-between rounded-2xl border border-border px-4 py-3">
                <div>
                  <div className="font-medium">{tx.counterparty}</div>
                  <div className="text-xs text-muted-fg">{format(parseISO(tx.created_at), "MMM d, p")}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{formatCurrency(Math.abs(tx.amount))}</div>
                  <Badge tone={tx.status === "completed" ? "success" : tx.status === "pending" ? "warning" : "danger"}>{tx.status}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="text-lg font-semibold">Recent Users</div>
            <Link href="/admin/users" className="inline-flex items-center gap-1 text-sm font-medium text-blue-600">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentUsers.slice(0, 5).map((user: any) => (
              <div key={user.id} className="rounded-2xl border border-border p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-medium">{user.full_name}</div>
                    <div className="text-xs text-muted-fg">{user.email}</div>
                  </div>
                  <Badge tone={user.status === "verified" ? "success" : user.status === "pending" ? "warning" : "danger"}>{user.status}</Badge>
                </div>
                <Separator className="my-3" />
                <div className="flex items-center justify-between text-sm text-muted-fg">
                  <span>{user.account_type}</span>
                  <span>{format(parseISO(user.created_at), "MMM d, yyyy")}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatusLine({ icon: Icon, label, value, tone }: any) {
  const tones: any = {
    success: "bg-emerald-500/15 text-emerald-600",
    info: "bg-blue-500/15 text-blue-600",
    warning: "bg-amber-500/15 text-amber-600"
  };
  return (
    <div className="flex items-center justify-between rounded-2xl border border-border px-4 py-3">
      <div className="flex items-center gap-3">
        <div className={`rounded-xl p-2 ${tones[tone]}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <div className="text-sm font-medium">{label}</div>
          <div className="text-xs text-muted-fg">Operational metric</div>
        </div>
      </div>
      <div className="text-sm font-semibold">{value}</div>
    </div>
  );
}
