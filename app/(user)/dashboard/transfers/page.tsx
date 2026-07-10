import { Card, CardContent, CardHeader, Input, Label, Button } from "@/components/ui";
import { demoTransactions } from "@/lib/mock-bank";
import { formatCurrency } from "@/lib/utils";
import { transferFunds } from "@/app/actions";

export default function TransfersPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
      <Card>
        <CardHeader>
          <div className="text-lg font-semibold">Internal + External Transfer</div>
          <div className="text-sm text-muted-fg">Transfer money securely using the atomic backend RPC.</div>
        </CardHeader>
        <CardContent>
          <form action={transferFunds} className="grid gap-4 md:grid-cols-2">
            <Field label="From account"><Input name="fromAccountId" placeholder="acc-1" /></Field>
            <Field label="Recipient account"><Input name="toAccountNumber" placeholder="1234567890" /></Field>
            <Field label="Amount"><Input name="amount" type="number" step="0.01" /></Field>
            <Field label="Note"><Input name="note" placeholder="Monthly support" /></Field>
            <div className="md:col-span-2"><Button type="submit">Send Money</Button></div>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><div className="text-lg font-semibold">Beneficiaries</div></CardHeader>
        <CardContent className="space-y-3">
          {demoTransactions.slice(0, 4).map((tx) => (
            <div key={tx.id} className="flex items-center justify-between rounded-2xl border border-border px-4 py-3">
              <div>
                <div className="font-medium">{tx.counterparty}</div>
                <div className="text-xs text-muted-fg">{tx.category}</div>
              </div>
              <div className="text-sm font-semibold">{formatCurrency(Math.abs(tx.amount))}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label><div className="mb-2 text-sm font-medium">{label}</div>{children}</label>;
}

