import { Card, CardContent, CardHeader, Button } from "@/components/ui";

export default function AdminSecurityPage() {
  return (
    <Card>
      <CardHeader><div className="text-lg font-semibold">Security Controls</div></CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between rounded-2xl border border-border px-4 py-3"><span>2FA Enforcement</span><Button variant="outline">Enable</Button></div>
        <div className="flex items-center justify-between rounded-2xl border border-border px-4 py-3"><span>IP Allowlist</span><Button variant="outline">Manage</Button></div>
      </CardContent>
    </Card>
  );
}

