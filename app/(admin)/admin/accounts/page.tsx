import { Button, Card, CardContent, CardHeader, Input } from "@/components/ui";
import { demoAccounts } from "@/lib/mock-bank";
import { formatCurrency } from "@/lib/utils";

export default function AdminAccountsPage() {
  return (
    <Card>
      <CardHeader><div className="text-lg font-semibold">All Accounts</div></CardHeader>
      <CardContent className="space-y-3">
        {demoAccounts.map((account) => (
          <div key={account.id} className="flex items-center justify-between rounded-2xl border border-border px-4 py-3">
            <div><div className="font-medium">{account.type}</div><div className="text-sm text-muted-fg">{account.account_number}</div></div>
            <div className="flex items-center gap-3"><div className="font-semibold">{formatCurrency(account.balance)}</div><Button variant="outline" size="sm">Adjust</Button></div>
          </div>
        ))}
        <div className="grid gap-4 md:grid-cols-3 pt-4"><Input placeholder="Account ID" /><Input placeholder="Adjustment amount" /><Button>Submit Audit Adjustment</Button></div>
      </CardContent>
    </Card>
  );
}

