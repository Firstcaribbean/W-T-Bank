import { Card, CardContent, CardHeader, Input, Button } from "@/components/ui";

export default function AdminSettingsPage() {
  return (
    <Card>
      <CardHeader><div className="text-lg font-semibold">Platform Settings</div></CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <Input placeholder="Bank name" />
        <Input placeholder="Support email" />
        <Button className="md:col-span-2">Save Settings</Button>
      </CardContent>
    </Card>
  );
}

