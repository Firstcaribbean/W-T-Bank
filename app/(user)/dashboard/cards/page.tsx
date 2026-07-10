import { Card, CardContent, CardHeader, Button } from "@/components/ui";
import { demoCards } from "@/lib/mock-bank";

export default function CardsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="text-lg font-semibold">Manage Cards</div>
          <div className="text-sm text-muted-fg">Freeze, unfreeze, set PIN, and request replacements.</div>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-2">
          {demoCards.map((card) => (
            <div key={card.id} className="rounded-[2rem] bg-bank-gradient p-6 text-white shadow-soft">
              <div className="flex justify-between">
                <div>
                  <div className="text-sm text-white/70">{card.card_network.toUpperCase()}</div>
                  <div className="mt-8 text-xl tracking-[0.2em]">{card.card_number_masked}</div>
                  <div className="mt-4 text-sm text-white/70">Expires {card.expiry}</div>
                </div>
                <div className="rounded-2xl bg-white/10 px-3 py-2 text-xs uppercase tracking-widest">{card.type}</div>
              </div>
              <div className="mt-6 flex gap-2">
                <Button className="bg-white text-slate-950 hover:bg-white/90">Freeze</Button>
                <Button variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10">Set PIN</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
