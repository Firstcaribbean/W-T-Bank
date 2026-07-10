import { Card, CardContent, CardHeader } from "@/components/ui";
import { SimpleBar } from "@/components/charts";

const holdings = [
  { name: "Index Fund", value: 44120 },
  { name: "Bond ETF", value: 18230 },
  { name: "Money Market", value: 9200 },
  { name: "Tech Equity", value: 24680 }
];

export default function InvestmentsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><div className="text-lg font-semibold">Portfolio Performance</div></CardHeader>
        <CardContent><SimpleBar data={holdings.map((item) => ({ name: item.name, count: item.value }))} dataKey="count" /></CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {holdings.map((holding) => (
          <Card key={holding.name}><CardContent className="p-5"><div className="text-sm text-muted-fg">{holding.name}</div><div className="mt-2 text-2xl font-semibold">${holding.value.toLocaleString()}</div></CardContent></Card>
        ))}
      </div>
    </div>
  );
}
