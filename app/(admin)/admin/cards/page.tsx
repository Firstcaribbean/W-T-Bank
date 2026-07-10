import { Card, CardContent, CardHeader, Button } from "@/components/ui";
import { demoCards } from "@/lib/mock-bank";

export default function AdminCardsPage() {
  return (
    <Card>
      <CardHeader><div className="text-lg font-semibold">Card Issuance</div></CardHeader>
      <CardContent className="space-y-4">
        {demoCards.map((card) => <div key={card.id} className="flex items-center justify-between rounded-2xl border border-border px-4 py-3"><div><div className="font-medium">{card.card_number_masked}</div><div className="text-sm text-muted-fg">{card.type}</div></div><Button variant="outline" size="sm">Revoke</Button></div>)}
      </CardContent>
    </Card>
  );
}

