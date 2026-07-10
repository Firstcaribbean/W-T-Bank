import { Card, CardContent, CardHeader, Input, Button } from "@/components/ui";

export default function LoansPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
      <Card>
        <CardHeader>
          <div className="text-lg font-semibold">Loan Application</div>
          <div className="text-sm text-muted-fg">Apply for personal, business, or education financing.</div>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-2">
            <Input placeholder="Loan amount" />
            <Input placeholder="Term months" />
            <Input placeholder="Interest rate" />
            <Input placeholder="Purpose" />
            <div className="md:col-span-2"><Button type="button">Submit Application</Button></div>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><div className="text-lg font-semibold">Repayment Schedule</div></CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-fg">
          <div>Month 1 - $420.00</div>
          <div>Month 2 - $420.00</div>
          <div>Month 3 - $420.00</div>
        </CardContent>
      </Card>
    </div>
  );
}

