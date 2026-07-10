import { Card, CardContent, CardHeader, Input, Badge } from "@/components/ui";
import { demoTransactions } from "@/lib/mock-bank";
import { formatCurrency } from "@/lib/utils";

export default function UserTransactionsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="text-lg font-semibold">Transaction History</div>
          <div className="text-sm text-muted-fg">Search, filter, and review your ledger activity.</div>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <Input placeholder="Search transactions" />
          <Input placeholder="Category" />
          <Input placeholder="Date range" />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="space-y-3 pt-6">
          {demoTransactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between rounded-2xl border border-border px-4 py-3">
              <div>
                <div className="font-medium">{tx.counterparty}</div>
                <div className="text-sm text-muted-fg">{tx.category}</div>
              </div>
              <div className="flex items-center gap-3">
                <Badge tone={tx.amount >= 0 ? "success" : "danger"}>{tx.type}</Badge>
                <div className={tx.amount >= 0 ? "font-semibold text-emerald-600" : "font-semibold text-red-600"}>{formatCurrency(Math.abs(tx.amount))}</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
