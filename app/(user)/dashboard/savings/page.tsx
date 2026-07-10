import { Card, CardContent, CardHeader } from "@/components/ui";

const goals = [
  { name: "Emergency Fund", progress: 74 },
  { name: "Vacation", progress: 41 },
  { name: "Home Upgrade", progress: 23 }
];

export default function SavingsPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-3">
      {goals.map((goal) => (
        <Card key={goal.name}>
          <CardHeader>
            <div className="text-lg font-semibold">{goal.name}</div>
          </CardHeader>
          <CardContent>
            <div className="h-3 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-blue-600" style={{ width: `${goal.progress}%` }} />
            </div>
            <div className="mt-2 text-sm text-muted-fg">{goal.progress}% funded</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

