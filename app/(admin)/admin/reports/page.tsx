import { Card, CardContent, CardHeader, Button } from "@/components/ui";

export default function AdminReportsPage() {
  return (
    <Card>
      <CardHeader><div className="text-lg font-semibold">Reports</div></CardHeader>
      <CardContent className="flex gap-3">
        <Button>Download CSV</Button>
        <Button variant="outline">Download PDF</Button>
      </CardContent>
    </Card>
  );
}
