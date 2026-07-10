import { Card, CardContent, CardHeader, Button } from "@/components/ui";

export default function AdminLoansPage() {
  return (
    <Card>
      <CardHeader><div className="text-lg font-semibold">Loan Review Queue</div></CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between rounded-2xl border border-border px-4 py-3"><div><div className="font-medium">Personal Loan #A122</div><div className="text-sm text-muted-fg">$12,000</div></div><Button>Approve</Button></div>
        <div className="flex items-center justify-between rounded-2xl border border-border px-4 py-3"><div><div className="font-medium">Business Loan #B220</div><div className="text-sm text-muted-fg">$40,000</div></div><Button variant="outline">Reject</Button></div>
      </CardContent>
    </Card>
  );
}

