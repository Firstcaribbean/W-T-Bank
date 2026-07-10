import { Card, CardContent, CardHeader, Button, Input } from "@/components/ui";
import { demoTransactions } from "@/lib/mock-bank";
import { formatCurrency } from "@/lib/utils";
import { payBill } from "@/app/actions";

export default function PaymentsPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
      <Card>
        <CardHeader>
          <div className="text-lg font-semibold">Bill Payment</div>
          <div className="text-sm text-muted-fg">Pay utilities, cable, subscriptions, and more.</div>
        </CardHeader>
        <CardContent>
          <form action={payBill} className="grid gap-4 md:grid-cols-2">
            <Input name="accountId" placeholder="Account ID" />
            <Input name="biller" placeholder="Biller name" />
            <Input name="amount" type="number" step="0.01" placeholder="Amount" />
            <Input name="reference" placeholder="Reference" />
            <div className="md:col-span-2"><Button type="submit">Pay Bill</Button></div>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><div className="text-lg font-semibold">Recent Bill Payments</div></CardHeader>
        <CardContent className="space-y-3">
          {demoTransactions.slice(0, 5).map((tx) => <HistoryRow key={tx.id} title={tx.counterparty} amount={Math.abs(tx.amount)} category={tx.category} />)}
        </CardContent>
      </Card>
    </div>
  );
}

function HistoryRow({ title, amount, category }: any) {
  return <div className="flex items-center justify-between rounded-2xl border border-border px-4 py-3"><div><div className="font-medium">{title}</div><div className="text-xs text-muted-fg">{category}</div></div><div className="font-semibold">{formatCurrency(amount)}</div></div>;
}
