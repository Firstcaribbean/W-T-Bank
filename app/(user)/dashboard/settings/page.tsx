import { Card, CardContent, CardHeader, Input, Button } from "@/components/ui";
import { updateProfileAction } from "@/app/actions";
import { demoProfile } from "@/lib/mock-bank";

export default function SettingsPage() {
  return (
    <Card>
      <CardHeader>
        <div className="text-lg font-semibold">Profile Settings</div>
      </CardHeader>
      <CardContent>
        <form action={updateProfileAction} className="grid gap-4 md:grid-cols-2">
          <Input name="full_name" defaultValue={demoProfile.full_name} />
          <Input name="phone" defaultValue={demoProfile.phone ?? ""} />
          <div className="md:col-span-2"><Button type="submit">Save Changes</Button></div>
        </form>
      </CardContent>
    </Card>
  );
}

