import { Card, CardContent, CardHeader, Input, Textarea, Button } from "@/components/ui";

export default function AdminNotificationsPage() {
  return (
    <Card>
      <CardHeader><div className="text-lg font-semibold">Compose Notification</div></CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <Input placeholder="Audience" />
        <Input placeholder="Title" />
        <Textarea className="md:col-span-2" placeholder="Message" />
        <Button className="md:col-span-2">Send Notification</Button>
      </CardContent>
    </Card>
  );
}
