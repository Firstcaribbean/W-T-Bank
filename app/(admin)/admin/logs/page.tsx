import { Card, CardContent, CardHeader } from "@/components/ui";

export default function AdminLogsPage() {
  return (
    <Card>
      <CardHeader><div className="text-lg font-semibold">Audit Logs</div></CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="rounded-2xl border border-border px-4 py-3">Admin approved KYC for Amina Yusuf</div>
        <div className="rounded-2xl border border-border px-4 py-3">Balance adjustment posted to account acc-1</div>
      </CardContent>
    </Card>
  );
}

