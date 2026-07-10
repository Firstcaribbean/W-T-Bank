import { Badge, Button, Card, CardContent, CardHeader } from "@/components/ui";
import { demoProfile } from "@/lib/mock-bank";

export default function AdminUsersPage() {
  return (
    <Card>
      <CardHeader><div className="text-lg font-semibold">User Management</div></CardHeader>
      <CardContent className="space-y-3">
        {[demoProfile].map((user) => (
          <div key={user.id} className="flex items-center justify-between rounded-2xl border border-border px-4 py-3">
            <div>
              <div className="font-medium">{user.full_name}</div>
              <div className="text-sm text-muted-fg">{user.email}</div>
            </div>
            <div className="flex items-center gap-2"><Badge tone="success">Verified</Badge><Button variant="outline" size="sm">Impersonate</Button></div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

