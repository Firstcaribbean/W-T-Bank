import { Card, CardContent, CardHeader, Input, Textarea, Button } from "@/components/ui";
import { demoNotifications } from "@/lib/mock-bank";
import { createSupportTicket } from "@/app/actions";

export default function SupportPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
      <Card>
        <CardHeader>
          <div className="text-lg font-semibold">Open a Support Ticket</div>
        </CardHeader>
        <CardContent>
          <form action={createSupportTicket} className="grid gap-4">
            <Input name="subject" placeholder="Subject" />
            <Textarea name="message" placeholder="Describe your issue" />
            <Button type="submit">Submit Ticket</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><div className="text-lg font-semibold">Recent Tickets</div></CardHeader>
        <CardContent className="space-y-3">
          {demoNotifications.map((ticket) => <div key={ticket.id} className="rounded-2xl border border-border p-4"><div className="font-medium">{ticket.title}</div><div className="text-sm text-muted-fg">{ticket.body}</div></div>)}
        </CardContent>
      </Card>
    </div>
  );
}

