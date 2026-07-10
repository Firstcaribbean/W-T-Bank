import { Card, CardContent, CardHeader, Button } from "@/components/ui";

export default function RewardsPage() {
  return (
    <Card>
      <CardHeader>
        <div className="text-lg font-semibold">Rewards Balance</div>
        <div className="text-sm text-muted-fg">Earn and redeem points across partner merchants.</div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-4xl font-semibold">18,240</div>
          <div className="text-sm text-muted-fg">Available points</div>
        </div>
        <Button>Redeem Rewards</Button>
      </CardContent>
    </Card>
  );
}
