import { Badge, Button, Card, CardContent, CardHeader, Input, Label } from "@/components/ui";
import { demoAccounts } from "@/lib/mock-bank";
import { formatCurrency, maskAccountNumber } from "@/lib/utils";

export default function AccountsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="text-lg font-semibold">Your Accounts</div>
          <div className="text-sm text-muted-fg">Open and manage checking, savings, and investment accounts.</div>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {demoAccounts.map((account) => (
            <div key={account.id} className="rounded-2xl border border-border p-4">
              <div className="flex items-center justify-between">
                <div className="font-medium capitalize">{account.type}</div>
                <Badge tone="success">Active</Badge>
              </div>
              <div className="mt-4 text-2xl font-semibold">{formatCurrency(account.balance)}</div>
              <div className="mt-1 text-sm text-muted-fg">{maskAccountNumber(account.account_number)}</div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="text-lg font-semibold">Open New Account</div>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-2">
            <Field label="Account type"><Input placeholder="Savings" /></Field>
            <Field label="Currency"><Input placeholder="USD" /></Field>
            <Field label="Initial deposit"><Input type="number" placeholder="500" /></Field>
            <div className="flex items-end"><Button type="button">Submit Request</Button></div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label><div className="mb-2 text-sm font-medium">{label}</div>{children}</label>;
}

