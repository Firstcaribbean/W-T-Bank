"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { formatCurrency } from "@/lib/utils";

function ChartTooltip({ active, payload, label, currency = "USD" }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold">{label}</p>
      {payload.map((item: any) => (
        <p key={item.dataKey} style={{ color: item.color }}>
          {item.name ?? item.dataKey}: {typeof item.value === "number" ? formatCurrency(item.value, currency) : item.value}
        </p>
      ))}
    </div>
  );
}

export function SpendingDonut({ data, total }: { data: { category: string; amount: number; color: string }[]; total: number }) {
  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="amount" nameKey="category" innerRadius={72} outerRadius={110} paddingAngle={3}>
            {data.map((entry) => (
              <Cell key={entry.category} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none -mt-[170px] flex flex-col items-center justify-center text-center">
        <span className="text-xs uppercase tracking-[0.3em] text-muted-fg">Spent</span>
        <span className="mt-1 text-3xl font-semibold">{formatCurrency(total)}</span>
      </div>
    </div>
  );
}

export function OverviewLineChart({ data }: { data: { name: string; count: number; amount: number }[] }) {
  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="name" tickLine={false} axisLine={false} />
          <YAxis yAxisId="left" tickLine={false} axisLine={false} />
          <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} />
          <Tooltip content={<ChartTooltip />} />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} dot={false} name="Transactions" />
          <Area yAxisId="right" type="monotone" dataKey="amount" stroke="#0f766e" fill="#14b8a6" fillOpacity={0.2} name="Amount" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SimpleBar({ data, dataKey = "count", xKey = "name" }: { data: any[]; dataKey?: string; xKey?: string }) {
  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey={xKey} tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <Tooltip content={<ChartTooltip />} />
          <Bar dataKey={dataKey} fill="#2563eb" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

