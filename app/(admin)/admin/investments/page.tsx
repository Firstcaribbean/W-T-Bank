import { Card, CardContent, CardHeader } from "@/components/ui";

export default function AdminInvestmentsPage() {
  return (
    <Card>
      <CardHeader><div className="text-lg font-semibold">Investment Products</div></CardHeader>
      <CardContent className="space-y-3">
        <div className="rounded-2xl border border-border px-4 py-3">Index Fund - 12.4% YTD</div>
        <div className="rounded-2xl border border-border px-4 py-3">Bond Ladder - 6.1% YTD</div>
      </CardContent>
    </Card>
  );
}
