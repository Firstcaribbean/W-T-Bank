import { Card, CardContent, CardHeader } from "@/components/ui";

const holdings = [
  ["Bitcoin", "0.42 BTC"],
  ["Ethereum", "3.18 ETH"],
  ["Solana", "120.40 SOL"]
];

export default function CryptoPage() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {holdings.map(([asset, amount]) => (
        <Card key={asset}><CardHeader><div className="text-lg font-semibold">{asset}</div></CardHeader><CardContent><div className="text-2xl font-semibold">{amount}</div></CardContent></Card>
      ))}
    </div>
  );
}

