import { Card, CardContent, CardHeader, Badge } from "@/components/ui";
import { demoTransactions } from "@/lib/mock-bank";
import { formatCurrency } from "@/lib/utils";

export default function AdminTransactionsPage() {
  return (
    <Card>
      <CardHeader><div className="text-lg font-semibold">Transaction Ledger</div></CardHeader>
      <CardContent className="space-y-3">
        {demoTransactions.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between rounded-2xl border border-border px-4 py-3">
            <div><div className="font-medium">{tx.counterparty}</div><div className="text-sm text-muted-fg">{tx.category}</div></div>
            <div className="flex items-center gap-3"><Badge tone={tx.status === "completed" ? "success" : "warning"}>{tx.status}</Badge><div className="font-semibold">{formatCurrency(Math.abs(tx.amount))}</div></div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

