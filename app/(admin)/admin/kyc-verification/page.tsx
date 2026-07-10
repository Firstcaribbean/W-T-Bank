import { Button, Card, CardContent, CardHeader } from "@/components/ui";
import { reviewKyc } from "@/app/actions";

export default function AdminKycPage() {
  return (
    <Card>
      <CardHeader><div className="text-lg font-semibold">KYC Review Queue</div></CardHeader>
      <CardContent className="space-y-3">
        <form action={reviewKyc} className="flex items-center justify-between rounded-2xl border border-border px-4 py-3">
          <input type="hidden" name="id" value="kyc-1" />
          <input type="hidden" name="status" value="verified" />
          <div><div className="font-medium">Amina Yusuf</div><div className="text-sm text-muted-fg">Passport + proof of address</div></div>
          <Button type="submit">Approve</Button>
        </form>
        <form action={reviewKyc} className="flex items-center justify-between rounded-2xl border border-border px-4 py-3">
          <input type="hidden" name="id" value="kyc-2" />
          <input type="hidden" name="status" value="rejected" />
          <div><div className="font-medium">Khalid Bello</div><div className="text-sm text-muted-fg">Utility bill mismatch</div></div>
          <Button type="submit" variant="outline">Reject</Button>
        </form>
      </CardContent>
    </Card>
  );
}

